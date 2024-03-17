package com.atts.tools.msystem.infrastucture.databases.mysql;

import com.atts.tools.msystem.domain.logging.Log;
import com.atts.tools.msystem.domain.ports.out.datastore.LogStoragePort;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.repositories.LogRepository;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.utils.Transformer;
import java.util.Collection;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class LogStorageAdapter implements LogStoragePort {

    private final Transformer transformer;
    private final LogRepository logRepository;

    @Override
    public Log save(Log log) {
        return transformer.transformToLog(logRepository.save(transformer.transformToLogEntity(log)));
    }

    @Override
    public void save(Collection<Log> logs) {
        logRepository.saveAll(logs.stream().map(transformer::transformToLogEntity).collect(Collectors.toList()));
    }

    @Override
    public void deleteAll() {
        logRepository.deleteAll();
    }
}
