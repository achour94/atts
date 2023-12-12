package com.atts.tools.msystem.domain.ports.in.usecases;

import com.atts.tools.msystem.domain.model.Invoice;
import com.atts.tools.msystem.domain.model.InvoiceAndTemplate;
import com.atts.tools.msystem.domain.model.InvoiceFile;
import java.util.List;

public interface ManageInvoicesUseCase {
    void generateInvoices(List<List<Object>> rows, String fileName);
    InvoiceFile generateFile(Integer invoiceId);
    void update(Invoice invoice);
    InvoiceFile getFile(Integer invoiceId);
    void sendInvoices(List<InvoiceAndTemplate> invoiceIds);
}
