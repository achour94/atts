package com.atts.tools.msystem.domain.ports.out.smtp;

import com.atts.tools.msystem.domain.model.InvoiceFile;

public interface EmailPort {
    void sendInvoice(String bodyText, InvoiceFile invoiceFile, String to);
    void sendLoginMailToChangePassword(String user, String password, String to);
}
