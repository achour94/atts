package com.atts.tools.msystem.application.rest.controllers;

import com.atts.tools.msystem.application.parsers.xlsx.StandardXlsxParser;
import com.atts.tools.msystem.domain.model.Invoice;
import com.atts.tools.msystem.domain.model.pageable.RequestPage;
import com.atts.tools.msystem.domain.model.pageable.SearchCriteria;
import com.atts.tools.msystem.domain.ports.in.usecases.ManageInvoicesUseCase;
import com.atts.tools.msystem.domain.ports.out.InvoiceCriteriaPort;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/invoice/")
@RequiredArgsConstructor
public class InvoicesController {

    private final ManageInvoicesUseCase manageInvoicesUseCase;
    private final StandardXlsxParser standardXlsxParser;
    private final InvoiceCriteriaPort invoiceCriteriaPort;


    @PostMapping("/upload")
    @PreAuthorize("hasRole('admin')")
    public void uploadCSV(MultipartFile file) throws IOException {
        manageInvoicesUseCase.generateInvoices(standardXlsxParser.extractXlsxRows(file.getInputStream()), file.getName());
    }

    @GetMapping("/")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<Page<Invoice>> getInvoices(RequestPage page, SearchCriteria criteria)
        throws NoSuchFieldException {
        //TODO return only minimum things that we need to view in the list of invoices
        //TODO improve error handling
        return ResponseEntity.ok(invoiceCriteriaPort.findAllWithFilters(page, criteria));
    }
}
