package com.atts.tools.msystem.application.rest.controllers;

import com.atts.tools.msystem.application.parsers.TableFileType;
import com.atts.tools.msystem.application.parsers.consumptions.ConsumptionsParser;
import com.atts.tools.msystem.application.rest.request.invoice.GeneratePDFRequest;
import com.atts.tools.msystem.application.rest.request.invoice.SendInvoiceByMailRequest;
import com.atts.tools.msystem.common.exceptions.ErrorMessageUtil;
import com.atts.tools.msystem.common.exceptions.types.IlegalRequestException;
import com.atts.tools.msystem.common.exceptions.types.NotFoundElementException;
import com.atts.tools.msystem.domain.model.Invoice;
import com.atts.tools.msystem.domain.model.InvoiceFile;
import com.atts.tools.msystem.domain.model.pageable.RequestPage;
import com.atts.tools.msystem.domain.model.pageable.SearchCriteria;
import com.atts.tools.msystem.domain.ports.in.usecases.ManageInvoicesUseCase;
import com.atts.tools.msystem.domain.ports.out.datastore.InvoiceCriteriaPort;
import com.atts.tools.msystem.domain.ports.out.datastore.InvoiceStoragePort;
import com.atts.tools.msystem.domain.services.GenerationConfig;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.repositories.criteria.CriteriaMapper;

import jakarta.activation.UnsupportedDataTypeException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/invoice")
@RequiredArgsConstructor
public class InvoicesController {

    private final ManageInvoicesUseCase manageInvoicesUseCase;
    private final List<ConsumptionsParser> consumptionsParsers;
    private final InvoiceStoragePort invoiceStoragePort;
    private final InvoiceCriteriaPort invoiceCriteriaPort;
    private final CriteriaMapper criteriaMapper;


    @PostMapping("/upload")
    @PreAuthorize("hasRole('admin')")
    public void uploadFile(MultipartFile file, GenerationConfig generationConfig)
        throws IOException, IlegalRequestException {
        TableFileType tableFileType = TableFileType.convert(Objects.requireNonNull(file.getOriginalFilename()));
        manageInvoicesUseCase.generateInvoices(
            consumptionsParsers.stream().filter(parser -> parser.match(tableFileType)).findAny().orElseThrow(
                UnsupportedDataTypeException::new).extractRows(file.getInputStream()),
            file.getOriginalFilename(), generationConfig);
    }

    @GetMapping("/{invoiceNumber}")
    public ResponseEntity<Invoice> getInvoice(@PathVariable Integer invoiceNumber) throws NotFoundElementException {
        return ResponseEntity.ok(
            invoiceStoragePort.findById(invoiceNumber).orElseThrow(() -> new NotFoundElementException(
                ErrorMessageUtil.invoiceWithIdNotFound(invoiceNumber))));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('admin', 'client')")
    public ResponseEntity<Page<Invoice>> getInvoices(RequestPage page, String criteria, String status) {
      List<SearchCriteria> criterias = new ArrayList<>(criteriaMapper.convert(criteria));
        if (status != null) {
            criterias.add(SearchCriteria.builder().column("status").equals(status).build());
        }
        return ResponseEntity.ok(
            invoiceCriteriaPort.findAllWithFiltersAndRestrictions(page, criterias));
    }

    @PutMapping
    @PreAuthorize("hasRole('admin')")
    public void update(@RequestBody Invoice invoice) throws IlegalRequestException {
        manageInvoicesUseCase.update(invoice);

    }

    @GetMapping("/pdf/{invoiceNumber}")
    @PreAuthorize("@securityService.hasPermission('INVOICE', #invoiceNumber)")
    public ResponseEntity<Resource> getPDF(@PathVariable Integer invoiceNumber) throws IlegalRequestException {
        InvoiceFile invoiceFile = manageInvoicesUseCase.getFile(invoiceNumber);
        return getResourceResponseEntity(invoiceFile);
    }

    @PutMapping("/pdf")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<Resource> generatePDF(@RequestBody GeneratePDFRequest request) {
        InvoiceFile invoiceFile = manageInvoicesUseCase.generateFile(request.id());
        return getResourceResponseEntity(invoiceFile);
    }

    private ResponseEntity<Resource> getResourceResponseEntity(InvoiceFile invoiceFile) {
        ByteArrayResource resource = new ByteArrayResource(invoiceFile.getContent());
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION,
            String.format("attachment; filename=%s", invoiceFile.getFilename()));
        headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_PDF_VALUE);
        return ResponseEntity.ok()
            .headers(headers)
            .contentLength(invoiceFile.getContent().length)
            .contentType(MediaType.APPLICATION_PDF)
            .body(resource);
    }

    @PutMapping("/email")
    @PreAuthorize("hasRole('admin')")
    public void sendInvoice(@RequestBody SendInvoiceByMailRequest request) throws IlegalRequestException {
        manageInvoicesUseCase.sendInvoices(request.getInvoices());
    }

    @DeleteMapping("/{invoiceIds}")
    public void deleteInvoices(@PathVariable List<Integer> invoiceIds) throws NotFoundElementException {
        manageInvoicesUseCase.deleteInvoices(invoiceIds);
    }
}
