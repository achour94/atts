package com.atts.tools.msystem.application.rest.controllers;

import aj.org.objectweb.asm.TypeReference;
import com.atts.tools.msystem.application.parsers.xlsx.StandardXlsxParser;
import com.atts.tools.msystem.application.rest.request.invoice.GeneratePDFRequest;
import com.atts.tools.msystem.domain.model.Invoice;
import com.atts.tools.msystem.domain.model.InvoiceFile;
import com.atts.tools.msystem.domain.model.pageable.RequestPage;
import com.atts.tools.msystem.domain.ports.in.usecases.ManageInvoicesUseCase;
import com.atts.tools.msystem.domain.ports.out.datastore.InvoiceCriteriaPort;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.repositories.criteria.CriteriaMapper;
import com.fasterxml.jackson.core.JsonProcessingException;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
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
    private final StandardXlsxParser standardXlsxParser;
    private final InvoiceCriteriaPort invoiceCriteriaPort;
    private final CriteriaMapper criteriaMapper;


    @PostMapping("/upload")
    @PreAuthorize("hasRole('admin')")
    public void uploadCSV(MultipartFile file) throws IOException {
        manageInvoicesUseCase.generateInvoices(standardXlsxParser.extractXlsxRows(file.getInputStream()),
            file.getName());
    }

    @GetMapping
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<Page<Invoice>> getInvoices(RequestPage page, String criteria) throws JsonProcessingException {
        //TODO return only minimum things that we need to view in the list of invoices
        return ResponseEntity.ok(invoiceCriteriaPort.findAllWithFilters(page, criteriaMapper.convert(criteria)));
    }

    @PutMapping("/pdf")
    public ResponseEntity<Resource> generatePDF(@RequestBody GeneratePDFRequest request) {
        InvoiceFile invoiceFile = manageInvoicesUseCase.generateFile(request.id());
        ByteArrayResource resource = new ByteArrayResource(invoiceFile.getContent());
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, String.format("attachment; filename=%s", invoiceFile.getFilename()));
        headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_PDF_VALUE);
        return ResponseEntity.ok()
            .headers(headers)
            .contentLength(invoiceFile.getContent().length)
            .contentType(MediaType.APPLICATION_PDF)
            .body(resource);
    }
}
