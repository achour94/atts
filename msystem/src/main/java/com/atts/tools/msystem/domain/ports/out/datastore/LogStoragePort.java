package com.atts.tools.msystem.domain.ports.out.datastore;

import com.atts.tools.msystem.domain.logging.Log;
import java.util.Collection;

public interface LogStoragePort {
    Log save(Log log);
    void save(Collection<Log> logs);
}
