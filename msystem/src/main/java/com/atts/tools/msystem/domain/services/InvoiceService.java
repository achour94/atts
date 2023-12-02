package com.atts.tools.msystem.domain.services;

import com.atts.tools.msystem.common.annotations.UseCase;
import com.atts.tools.msystem.domain.model.Client;
import com.atts.tools.msystem.domain.model.Invoice;
import com.atts.tools.msystem.domain.model.Subscription;
import com.atts.tools.msystem.domain.model.contants.ClientConstants;
import com.atts.tools.msystem.domain.model.contants.InvoiceConstants;
import com.atts.tools.msystem.domain.model.types.ClientReference;
import com.atts.tools.msystem.domain.ports.in.usecases.ManageInvoicesUseCase;
import com.atts.tools.msystem.domain.ports.out.ClientStoragePort;
import com.atts.tools.msystem.domain.ports.out.InvoiceStoragePort;
import com.atts.tools.msystem.domain.ports.out.SubscriptionStoragePort;
import com.atts.tools.msystem.domain.services.processors.ClientSummary;
import com.atts.tools.msystem.domain.services.processors.ClientsResults;
import com.atts.tools.msystem.domain.services.processors.DefaultRowsProcessor;
import jakarta.transaction.Transactional;
import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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

    @Override
    @Transactional
    public void generateInvoices(List<List<Object>> rows, String fileName) {
        ClientsResults extractResults = defaultRowsProcessor.process(rows);
        List<Invoice> invoices = convertToInvoices(extractResults.getClientsSummary());
        invoiceStoragePort.save(invoices);
        //TODO manage errors from extractResults
    }

    public List<Invoice> convertToInvoices(Map<ClientReference, ClientSummary> clinetsSummary) {
        List<Client> clients = new ArrayList<>();
        List<Invoice> results = clinetsSummary.entrySet().stream().map(entry -> {
            ClientSummary summary = entry.getValue();
            Date creationDate = Date.valueOf(LocalDate.now());
            Date startDate = summary.getMinStartDate();
            Date endDate = summary.getMaxEndDate();
            Double htAmount = Double.valueOf(summary.getTotalConsumptions());
            Optional<Client> opClient = clientStoragePort.findBy(entry.getKey());
            Client client;
            if (opClient.isPresent()) {
                htAmount += computeAmountForClient(opClient.get());
                client = opClient.get();
            } else {
                client = Client.builder().clientReference(entry.getKey()).name(summary.getName())
                    .defaultSubscription(
                        ClientConstants.DEFAULT_SUBSCRIPTION)
                    .activeDiverse(ClientConstants.DEFAULT_ACTIVE_DIVERSE)
                    .diverseSubscription(ClientConstants.DEFAULT_DIVERSE_AMOUNT).address(summary.getAddress()).build();
                clients.add(client);
                htAmount += computeAmountForClient(client);
            }
            Double ttcAmount = summary.getHtTotal() + summary.getHtTotal() * InvoiceConstants.TVA / 100;
            return Invoice.builder().proforma(false).client(client).creationDate(creationDate).startPeriod(startDate)
                .endPeriod(endDate).consumptions(summary.getConsumptions())
                .httAmount(htAmount).ttcAmount(ttcAmount).consumptions(summary.getConsumptions()).build();
        }).collect(Collectors.toList());
        clientStoragePort.save(clients);
        return results;
    }

    private Double computeAmountForClient(Client client) {
        return client.getDefaultSubscription() + client.getDiverseSubscription() +
            +subscriptionStoragePort.findBy(client.getClientReference()).stream().map(Subscription::getPrice).reduce(
                Double::sum).orElse(0.0);
    }

}
