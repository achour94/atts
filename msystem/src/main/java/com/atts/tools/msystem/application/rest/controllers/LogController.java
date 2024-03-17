package com.atts.tools.msystem.application.rest.controllers;

import com.atts.tools.msystem.domain.logging.Log;
import com.atts.tools.msystem.domain.model.pageable.RequestPage;
import com.atts.tools.msystem.domain.ports.out.datastore.LogCriteriaPort;
import com.atts.tools.msystem.domain.ports.out.datastore.LogStoragePort;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.repositories.criteria.CriteriaMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/log")
@RequiredArgsConstructor
public class LogController {

    private final LogCriteriaPort logCriteriaPort;
    private final CriteriaMapper criteriaMapper;
    private final LogStoragePort logStoragePort;

    @GetMapping
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<Page<Log>> getLogs(RequestPage page, String criteria) {
        return ResponseEntity.ok(logCriteriaPort.findAllWithFilters(page, criteriaMapper.convert(criteria)));
    }

    @DeleteMapping
    @PreAuthorize("hasRole('admin')")
    public void deleteAllLogs() {
        logStoragePort.deleteAll();
    }
}
