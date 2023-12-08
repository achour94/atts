package com.atts.tools.msystem.domain.services;

import com.atts.tools.msystem.common.annotations.UseCase;
import com.atts.tools.msystem.domain.model.Client;
import com.atts.tools.msystem.domain.model.Consumption;
import com.atts.tools.msystem.domain.model.Invoice;
import com.atts.tools.msystem.domain.model.InvoiceFile;
import com.atts.tools.msystem.domain.model.Subscription;
import com.atts.tools.msystem.domain.model.contants.ClientConstants;
import com.atts.tools.msystem.domain.model.types.ClientReference;
import com.atts.tools.msystem.domain.ports.in.usecases.ManageInvoicesUseCase;
import com.atts.tools.msystem.domain.ports.out.datastore.ClientStoragePort;
import com.atts.tools.msystem.domain.ports.out.file.FileGeneratorPort;
import com.atts.tools.msystem.domain.ports.out.datastore.InvoiceStoragePort;
import com.atts.tools.msystem.domain.ports.out.datastore.SubscriptionStoragePort;
import com.atts.tools.msystem.domain.ports.out.storage.IFileStorage;
import com.atts.tools.msystem.domain.services.processors.ClientSummary;
import com.atts.tools.msystem.domain.services.processors.ClientsResults;
import com.atts.tools.msystem.domain.services.processors.DefaultRowsProcessor;

import jakarta.transaction.Transactional;
import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;


@UseCase
@RequiredArgsConstructor
public class InvoiceService implements ManageInvoicesUseCase {

    private final DefaultRowsProcessor defaultRowsProcessor;

    private final InvoiceStoragePort invoiceStoragePort;

    private final ClientStoragePort clientStoragePort;

    private final SubscriptionStoragePort subscriptionStoragePort;

    private final FileGeneratorPort fileGeneratorPort;

    private final IFileStorage fileStorage;

    @Override
    @Transactional
    public void generateInvoices(List<List<Object>> rows, String fileName) {
        ClientsResults extractResults = defaultRowsProcessor.process(rows);
        List<Invoice> invoices = convertToInvoices(extractResults.getClientsSummary());
        invoiceStoragePort.save(invoices);
        //TODO manage errors from extractResults
    }

    @Override
    public InvoiceFile generateFile(Integer invoiceId) {
        Optional<Invoice> opInvoice = invoiceStoragePort.findById(invoiceId);
        if (opInvoice.isEmpty()) {
            throw new NoSuchElementException();
        }
        byte[] file = fileGeneratorPort.generateFile(opInvoice.get());
        String filename =
            "facture_" + opInvoice.get().getClient().getName().strip().replaceAll(" ", "_") + "_" +
                invoiceId + "." + fileGeneratorPort.getFileType();
        InvoiceFile invoiceFile = InvoiceFile.builder().content(file).filename(filename).build();
        fileStorage.save(invoiceFile);
        return invoiceFile;
    }


    public List<Invoice> convertToInvoices(Map<ClientReference, ClientSummary> clientsSummary) {
        List<Client> clients = new ArrayList<>();
        List<Invoice> results = clientsSummary.entrySet().stream().map(entry -> {
            ClientSummary summary = entry.getValue();
            Date creationDate = Date.valueOf(LocalDate.now());
            Optional<Client> opClient = clientStoragePort.findBy(entry.getKey());
            Client client;
            if (opClient.isPresent()) {
                client = opClient.get();
            } else {
                client = Client.builder().clientReference(entry.getKey()).name(summary.getName())
                    .defaultSubscription(
                        ClientConstants.DEFAULT_SUBSCRIPTION)
                    .activeDiverse(ClientConstants.DEFAULT_ACTIVE_DIVERSE)
                    .diverseSubscription(ClientConstants.DEFAULT_DIVERSE_AMOUNT).address(summary.getAddress()).build();
                clients.add(client);
            }
            Invoice invoice = Invoice.builder().proforma(false).client(client).creationDate(creationDate)
                .consumptions(summary.getConsumptions()).tva(summary.getTva()).consumptions(summary.getConsumptions())
                .build();
            updateInvoiceBasedOnConsumptions(invoice);
            return invoice;
        }).collect(Collectors.toList());
        clientStoragePort.save(clients);
        return results;
    }

    private void updateInvoiceBasedOnConsumptions(Invoice invoice) {
        Date minStartDate = null;
        Date maxEndDate = null;
        Double totalHtAmount = 0.0;

        for (Consumption consumption : invoice.getConsumptions()) {
            minStartDate = minDate(minStartDate, consumption.getStartDate());
            maxEndDate = maxDate(maxEndDate, consumption.getEndDate());
            totalHtAmount += consumption.getHtAmount();
        }
        totalHtAmount += computeAmountForClient(invoice.getClient());
        totalHtAmount += invoice.getClient().getDefaultSubscription();
        totalHtAmount += invoice.getClient().getDiverseSubscription();

        Double ttcTotalAmount = totalHtAmount * (1 + invoice.getTva() / 100);

        invoice.setTtcAmount(keep2Digits(ttcTotalAmount));
        invoice.setHttAmount(keep2Digits(totalHtAmount));
        invoice.setStartPeriod(minStartDate);
        invoice.setEndPeriod(maxEndDate);
    }

    private Double keep2Digits(Double value) {
        return Math.floor(value * 100) / 100;
    }

    private Date minDate(Date date1, Date date2) {
        if (date1 == null) {
            return date2;
        }
        if (date2 == null) {
            return date1;
        }

        return date1.compareTo(date2) > 0 ? date2 : date1;

    }

    private Date maxDate(Date date1, Date date2) {
        if (date1 == null) {
            return date2;
        }
        if (date2 == null) {
            return date1;
        }

        return date1.compareTo(date2) > 0 ? date1 : date2;
    }

    private Double computeAmountForClient(Client client) {
        return client.getDefaultSubscription() + client.getDiverseSubscription() +
            +subscriptionStoragePort.findBy(client.getClientReference()).stream().map(Subscription::getPrice).reduce(
                Double::sum).orElse(0.0);
    }

}
