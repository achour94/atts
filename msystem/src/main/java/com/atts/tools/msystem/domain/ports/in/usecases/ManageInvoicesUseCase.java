package com.atts.tools.msystem.domain.ports.in.usecases;

import com.atts.tools.msystem.common.exceptions.types.IlegalRequestException;
import com.atts.tools.msystem.common.exceptions.types.NotFoundElementException;
import com.atts.tools.msystem.domain.model.Invoice;
import com.atts.tools.msystem.domain.model.InvoiceAndTemplate;
import com.atts.tools.msystem.domain.model.InvoiceFile;
import com.atts.tools.msystem.domain.services.GenerationConfig;
import java.util.List;

public interface ManageInvoicesUseCase {
    void generateInvoices(List<List<Object>> rows, String fileName, GenerationConfig config);
    InvoiceFile generateFile(Integer invoiceId);
    void update(Invoice invoice) throws IlegalRequestException;
    InvoiceFile getFile(Integer invoiceId) throws IlegalRequestException;
    void sendInvoices(List<InvoiceAndTemplate> invoiceIds) throws IlegalRequestException;
    void deleteInvoices(List<Integer> invoiceIds) throws NotFoundElementException;
    void shareInvoices(List<Integer> invoiceIds);
    InvoiceFile generateZipWithInvoices(List<Integer> invoiceIds);
}
