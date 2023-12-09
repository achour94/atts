package com.atts.tools.msystem.domain.ports.out.datastore;

import com.atts.tools.msystem.domain.model.Invoice;
import java.util.Collection;
import java.util.Optional;

public interface InvoiceStoragePort {

    void save(Collection<Invoice> invoices);
    void save(Invoice invoice);
    Optional<Invoice> findById(Integer id);
}
