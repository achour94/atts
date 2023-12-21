package com.atts.tools.msystem.domain.ports.out.datastore;

import com.atts.tools.msystem.domain.model.Client;
import com.atts.tools.msystem.domain.model.Invoice;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface InvoiceStoragePort {

    void save(Collection<Invoice> invoices);
    void save(Invoice invoice);
    Optional<Invoice> findById(Integer id);
    List<Invoice> findByClients(List<Client> clients);
    void delete(Collection<Invoice> invoices);
    void delete(List<Integer> invoiceIds);
}
