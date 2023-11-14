package com.atts.tools.msystem.application.rest.controllers;

import com.atts.tools.msystem.application.rest.response.ImportCSVInvoicesReponse;
import com.atts.tools.msystem.domain.ports.in.usecases.ManageInvoicesUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @PostMapping("/upload")
    public ResponseEntity<ImportCSVInvoicesReponse> uploadCSV(MultipartFile file) throws IOException {
        manageInvoicesUseCase.generateListOfClientsViaCsv(file.getBytes());
        return null;
    }
}
