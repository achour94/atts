package com.atts.tools.msystem.application.rest.request.invoice;

import com.atts.tools.msystem.domain.model.InvoiceAndTemplate;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SendInvoiceByMailRequest {

    List<InvoiceAndTemplate> invoices;
}
