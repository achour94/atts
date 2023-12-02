package com.atts.tools.msystem.domain.ports.out;

import com.atts.tools.msystem.domain.model.Invoice;
import java.util.Collection;

public interface InvoiceStoragePort {

    void save(Collection<Invoice> invoices);
}
