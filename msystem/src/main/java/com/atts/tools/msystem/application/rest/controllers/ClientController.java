package com.atts.tools.msystem.application.rest.controllers;

import com.atts.tools.msystem.domain.model.Client;
import com.atts.tools.msystem.domain.model.pageable.RequestPage;
import com.atts.tools.msystem.domain.model.pageable.SearchCriteria;
import com.atts.tools.msystem.domain.ports.out.ClientCriteriaPort;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/client/")
@RestController
@RequiredArgsConstructor
public class ClientController {

    private final ClientCriteriaPort clientCriteriaPort;

    @GetMapping("/")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<Page<Client>> getClients(RequestPage page, SearchCriteria criteria) {
        //TODO return only minimum things that we need to view in the list of Client
        return ResponseEntity.ok(clientCriteriaPort.findAllWithFilters(page, criteria));
    }
}
