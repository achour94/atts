package com.atts.tools.msystem.application.rest.controllers;

import com.atts.tools.msystem.domain.model.Client;
import com.atts.tools.msystem.domain.model.pageable.RequestPage;
import com.atts.tools.msystem.domain.ports.in.usecases.ManageClientUseCase;
import com.atts.tools.msystem.domain.ports.out.datastore.ClientCriteriaPort;
import com.atts.tools.msystem.domain.ports.out.datastore.ClientStoragePort;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.repositories.criteria.CriteriaMapper;
import java.util.NoSuchElementException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
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

@RequestMapping("/api/client")
@RestController
@RequiredArgsConstructor
public class ClientController {

    private final ClientCriteriaPort clientCriteriaPort;
    private final ClientStoragePort clientStoragePort;
    private final CriteriaMapper criteriaMapper;
    private final ManageClientUseCase manageClientUseCase;

    @GetMapping
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<Page<Client>> getClients(RequestPage page, String criteria) {
        //TODO return only minimum things that we need to view in the list of Client
        return ResponseEntity.ok(clientCriteriaPort.findAllWithFilters(page, criteriaMapper.convert(criteria)));
    }

    @GetMapping("{clientId}")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<Client> getClient(@PathVariable Integer clientId) {
        return ResponseEntity.ok(clientStoragePort.findById(clientId).orElseThrow(NoSuchElementException::new));
    }

    @PostMapping
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<Client> createClient(@RequestBody Client client) {
        return ResponseEntity.ok(manageClientUseCase.create(client));
    }

    @DeleteMapping("/{clientId}")
    @PreAuthorize("hasRole('admin')")
    public void delete(@PathVariable Integer clientId) {
        manageClientUseCase.delete(clientId);
    }

    @PutMapping
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<Client> updateClient(@RequestBody Client client) {
        return ResponseEntity.ok(manageClientUseCase.update(client));
    }
}
