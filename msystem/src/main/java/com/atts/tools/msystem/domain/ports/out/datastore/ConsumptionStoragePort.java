package com.atts.tools.msystem.domain.ports.out.datastore;

import com.atts.tools.msystem.domain.model.Consumption;
import java.util.Collection;

public interface ConsumptionStoragePort {
    void delete(Collection<Consumption> consumptions);
}
