package com.atts.tools.msystem.domain.services;

import com.atts.tools.msystem.common.annotations.UseCase;
import com.atts.tools.msystem.common.config.security.AuthorizationUtil;
import com.atts.tools.msystem.common.exceptions.ErrorMessageUtil;
import com.atts.tools.msystem.common.exceptions.types.IlegalRequestException;
import com.atts.tools.msystem.common.exceptions.types.NotFoundElementException;
import com.atts.tools.msystem.common.util.Math;
import com.atts.tools.msystem.domain.logging.InfoLog;
import com.atts.tools.msystem.domain.logging.Log;
import com.atts.tools.msystem.domain.logging.LogSource;
import com.atts.tools.msystem.domain.logging.SecurityLevel;
import com.atts.tools.msystem.domain.model.Client;
import com.atts.tools.msystem.domain.model.Consumption;
import com.atts.tools.msystem.domain.model.EmailTemplate;
import com.atts.tools.msystem.domain.model.Invoice;
import com.atts.tools.msystem.domain.model.InvoiceAndTemplate;
import com.atts.tools.msystem.domain.model.InvoiceFile;
import com.atts.tools.msystem.domain.model.contants.InvoiceConstants;
import com.atts.tools.msystem.domain.model.enums.ConsumptionType;
import com.atts.tools.msystem.domain.model.enums.InvoiceStatus;
import com.atts.tools.msystem.domain.model.Subscription;
import com.atts.tools.msystem.domain.model.User;
import com.atts.tools.msystem.domain.model.contants.ClientConstants;
import com.atts.tools.msystem.domain.model.types.ClientReference;
import com.atts.tools.msystem.domain.ports.in.usecases.ManageInvoicesUseCase;
import com.atts.tools.msystem.domain.ports.out.datastore.ClientStoragePort;
import com.atts.tools.msystem.domain.ports.out.datastore.ConsumptionStoragePort;
import com.atts.tools.msystem.domain.ports.out.datastore.LogStoragePort;
import com.atts.tools.msystem.domain.ports.out.datastore.UserStoragePort;
import com.atts.tools.msystem.domain.ports.out.file.FileGeneratorPort;
import com.atts.tools.msystem.domain.ports.out.datastore.InvoiceStoragePort;
import com.atts.tools.msystem.domain.ports.out.datastore.SubscriptionStoragePort;
import com.atts.tools.msystem.domain.ports.out.smtp.EmailPort;
import com.atts.tools.msystem.domain.ports.out.storage.IFileStorage;
import com.atts.tools.msystem.domain.services.processors.ClientSummary;
import com.atts.tools.msystem.domain.services.processors.ClientsResults;
import com.atts.tools.msystem.domain.services.processors.DefaultRowsProcessor;

import jakarta.transaction.Transactional;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.sql.Date;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import lombok.RequiredArgsConstructor;


@UseCase
@RequiredArgsConstructor
@Transactional
public class InvoiceService implements ManageInvoicesUseCase {

    private final DefaultRowsProcessor defaultRowsProcessor;

    private final InvoiceStoragePort invoiceStoragePort;

    private final ClientStoragePort clientStoragePort;

    private final SubscriptionStoragePort subscriptionStoragePort;

    private final FileGeneratorPort fileGeneratorPort;

    private final IFileStorage fileStorage;

    private final EmailPort emailPort;

    private final UserStoragePort userStoragePort;

    private final AuthorizationUtil authorizationUtil;

    private final LogStoragePort logStoragePort;

    private final ConsumptionStoragePort consumptionStoragePort;

    @Override
    @Transactional
    public void generateInvoices(List<List<Object>> rows, String fileName, GenerationConfig config) {
        ClientsResults extractResults = defaultRowsProcessor.process(rows);
        List<Invoice> invoices = convertToInvoices(extractResults.getClientsSummary(), config);
        invoices.addAll(Objects.requireNonNull(buildInvoicesWithoutConsumptionsForClients(
            clientStoragePort.findAllClientsThatAreNotInTheList(extractResults.getClientsSummary().keySet()), config)));
        invoiceStoragePort.save(invoices);
        logStoragePort.save(extractResults.getErrors().stream().map(processError -> Log.builder()
            .level(SecurityLevel.ERROR).source(LogSource.INVOICE_FILE_PROCESSING).message(
                String.format("In file %s at line %s is the following error %s", fileName, processError.lineNr(),
                    processError.message())).build()).collect(Collectors.toList()));

    }

    private List<Invoice> buildInvoicesWithoutConsumptionsForClients(List<Client> clients, GenerationConfig config) {
        return
            clients.stream().map(client -> {
                Date creationDate = null;
                if (config.getCreationDate() != null) {
                    creationDate = Date.valueOf(config.getCreationDate());
                }
                Boolean proforma =
                    config.getProforma() == null ? InvoiceConstants.DEFAULT_PROFORMA : config.getProforma();

                Invoice invoice = Invoice.builder().status(InvoiceStatus.DRAFT)
                    .proforma(proforma).client(client)
                    .creationDate(creationDate)
                    .consumptions(Collections.emptyList()).tva(InvoiceConstants.TVA)
                    .ttcAmount(computeAmountForClient(client))
                    .specialNumbers(false)
                    .startPeriod(InvoiceConstants.defaultStartPeriod())
                    .endPeriod(InvoiceConstants.defaultEndPeriod())
                    .build();

                Double totalHtAmount = computeAmountForClient(invoice.getClient());
                Double ttcTotalAmount = totalHtAmount * (1 + invoice.getTva() / 100);
                invoice.setTtcAmount(Math.keep2Digits(ttcTotalAmount));
                invoice.setHtAmount(Math.keep2Digits(totalHtAmount));

                return invoice;
            }).collect(Collectors.toList());
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
        fileStorage.saveInvoice(invoiceFile);
        opInvoice.get().setFileUri(invoiceFile.getFilename());
        invoiceStoragePort.save(opInvoice.get());
        return invoiceFile;
    }

    @Override
    public void update(Invoice invoice) throws IlegalRequestException {
        Optional<Invoice> opInvoice = invoiceStoragePort.findById(invoice.getId());

        if (invoice.getId() == null || opInvoice.isEmpty()) {
            if (invoice.getId() == null) {
                throw new IlegalRequestException();
            } else {
                throw new IlegalRequestException(ErrorMessageUtil.invoiceWithIdNotFound(invoice.getId()));
            }
        }
        List<Consumption> consumptionsToDelete = opInvoice.get().getConsumptions().stream().filter(
                consumption -> invoice.getConsumptions().stream().noneMatch(con -> consumption.getId().equals(con.getId())))
            .toList();

        consumptionStoragePort.delete(consumptionsToDelete);
        updateInvoiceBasedOnConsumptionsAndClient(invoice, invoice.getClient());
        updateStartEndDateConsumptionsOrInvoice(invoice);
        invoiceStoragePort.save(invoice);
    }

    private void updateStartEndDateConsumptionsOrInvoice(Invoice invoice) {
        boolean invoiceHasStartAndEndPeriod = invoice.getStartPeriod() != null && invoice.getEndPeriod() != null;
        Date startDate = null;
        Date endDate = null;
        for (Consumption consumption : invoice.getConsumptions()) {
            if (invoiceHasStartAndEndPeriod) {
                consumption.setStartDate(invoice.getStartPeriod());
                consumption.setEndDate(invoice.getEndPeriod());
            } else {
                startDate = minDate(startDate, consumption.getStartDate());
                endDate = maxDate(endDate, consumption.getEndDate());
            }
        }
        if (!invoiceHasStartAndEndPeriod) {
            invoice.setStartPeriod(startDate);
            invoice.setEndPeriod(endDate);
        }
    }

    @Override
    public InvoiceFile getFile(Integer invoiceId) throws IlegalRequestException {
        Optional<Invoice> opInvoice = invoiceStoragePort.findById(invoiceId);
        if (opInvoice.isEmpty()) {
            throw new IlegalRequestException(ErrorMessageUtil.invoiceWithIdNotFound(invoiceId));
        }
        Invoice invoice = opInvoice.get();
        if (invoice.getFileUri() == null) {
            return generateFile(invoiceId);
        }
        return fileStorage.getInvoice(invoice.getFileUri());
    }

    @Override
    public void sendInvoices(List<Integer> invoiceIds, String emailContent) throws IlegalRequestException {
        for (Integer invoiceId : invoiceIds) {
            Invoice invoice = invoiceStoragePort.findById(invoiceId).orElse(null);
            if (invoice != null) {
                InvoiceFile invoiceFile = getFile(invoice.getId());
                List<String> emails = invoice.getClient().getUsers().stream()
                        .map(User::getEmail)
                        .filter(Objects::nonNull)
                        .toList();

                // Use the provided email content directly instead of fetching from template
                String finalEmailContent = emailContent;

                for (String email : emails) {
                    emailPort.sendInvoice(finalEmailContent, invoiceFile, email);
                }
            } else {
                // Handle the case where the invoice is not found. You could log a warning or throw an exception.
            }
        }
    }

    @Override
    @InfoLog(source = LogSource.INVOICE, messageTemplate = "Invoices with the following ids: %s were deleted", argsFunction = {
        0})
    public void deleteInvoices(List<Integer> invoiceIds) throws NotFoundElementException {
        //TODO additional checks
        invoiceStoragePort.delete(invoiceIds);
    }

    @Override
    @InfoLog(source = LogSource.INVOICE, messageTemplate = "All draft invoices were deleted")
    public void deleteDraftInvoices() {
        invoiceStoragePort.delete(invoiceStoragePort.findAllInvoicesByStatus(InvoiceStatus.DRAFT));
    }

    @Override
    public void shareInvoices(List<Integer> invoiceIds) {
        invoiceStoragePort.save(invoiceStoragePort.findAllByIds(invoiceIds).stream()
            .peek(invoice -> invoice.setStatus(InvoiceStatus.SHARED)).collect(Collectors.toList()));
    }

    @Override
    public InvoiceFile generateZipWithInvoices(List<Integer> invoiceIds) {
        List<InvoiceFile> invoiceFiles = invoiceIds.stream().map(id -> {
            try {
                return getFile(id);
            } catch (IlegalRequestException e) {
                throw new RuntimeException(e);
            }
        }).toList();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ZipOutputStream zos = new ZipOutputStream(outputStream);
        for (InvoiceFile file : invoiceFiles) {
            ZipEntry zipEntry = new ZipEntry(file.getFilename());
            try {
                zos.putNextEntry(zipEntry);
                zos.write(file.getContent());
                zos.closeEntry();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
        try {
            zos.close();
            outputStream.close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return InvoiceFile.builder().content(outputStream.toByteArray()).filename("invoices.zip").build();
    }

    public List<Invoice> convertToInvoices(Map<ClientReference, ClientSummary> clientsSummary,
        GenerationConfig config) {
        List<Client> clients = new ArrayList<>();
        List<Invoice> results = clientsSummary.entrySet().stream().map(entry -> {
            ClientSummary summary = entry.getValue();
            if (config.getReset() != null && config.getReset()) {
                //set htAmount for resetable consumption to 0
                for (Consumption consumption : summary.getConsumptions()) {
                    if (ConsumptionType.isResetableConsumption(consumption.getType())) {
                        consumption.setHtAmount(0.0);
                    }
                }
            }
            Date creationDate = null;
            if (config.getCreationDate() != null) {
                creationDate = Date.valueOf(config.getCreationDate());
            }
            Boolean proforma = config.getProforma() == null ? InvoiceConstants.DEFAULT_PROFORMA : config.getProforma();
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
            Invoice invoice = Invoice.builder().status(InvoiceStatus.DRAFT).proforma(proforma).client(client)
                .creationDate(creationDate)
                .consumptions(summary.getConsumptions()).tva(summary.getTva()).consumptions(summary.getConsumptions())
                .build();
            updateStartEndDateConsumptionsOrInvoice(invoice);
            updateInvoiceBasedOnConsumptionsAndClient(invoice, invoice.getClient());
            return invoice;
        }).collect(Collectors.toList());
        clientStoragePort.save(clients);
        return results;
    }

    public void updateInvoiceBasedOnConsumptionsAndClient(Invoice invoice, Client client) {
        Double totalHtAmount = 0.0;
        Double totalSvaConsumptionsHtAmount = 0.0;
        for (Consumption consumption : invoice.getConsumptions()) {
            totalHtAmount += consumption.getHtAmount();
            if (consumption.getType().getLabel().contains("SVA")) {
                totalSvaConsumptionsHtAmount += consumption.getHtAmount();
            }
        }
        totalHtAmount += computeAmountForClient(client);

        Double ttcTotalAmount = totalHtAmount * (1 + invoice.getTva() / 100);

        invoice.setTtcAmount(Math.keep2Digits(ttcTotalAmount));
        invoice.setHtAmount(Math.keep2Digits(totalHtAmount));
        invoice.setSpecialNumbers(totalSvaConsumptionsHtAmount > 0.0);
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
        Double result = client.getDefaultSubscription() +
            +subscriptionStoragePort.findBy(client.getClientReference()).stream().map(Subscription::getPrice).reduce(
                Double::sum).orElse(0.0);
        if (client.getActiveDiverse()) {
            result += client.getDiverseSubscription();
        }
        return result;
    }

}
