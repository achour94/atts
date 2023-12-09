package com.atts.tools.msystem.domain.ports.out.storage;

import com.atts.tools.msystem.domain.model.InvoiceFile;

public interface IFileStorage {

    void saveInvoice(InvoiceFile invoiceFile);

    InvoiceFile getInvoice(String fileName);
}
