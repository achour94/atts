package com.atts.tools.msystem.domain.ports.out.storage;

import com.atts.tools.msystem.domain.model.InvoiceFile;

public interface IFileStorage {

    void save(InvoiceFile invoiceFile);

    InvoiceFile getFile(String fileUri);
}
