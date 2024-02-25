package com.atts.tools.msystem.infrastucture.storage;

import com.atts.tools.msystem.domain.model.InvoiceFile;
import com.atts.tools.msystem.domain.ports.out.storage.IFileStorage;
import org.springframework.stereotype.Component;

//@Component("ionos")
public class IonosStorage implements IFileStorage {

    @Override
    public void saveInvoice(InvoiceFile invoiceFile) {

    }

    @Override
    public InvoiceFile getInvoice(String fileName) {
        return null;
    }
}
