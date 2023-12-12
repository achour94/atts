package com.atts.tools.msystem.domain.model;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InvoiceAndTemplate {
    @NotNull
    Integer invoiceId;
    Integer templateId;
}
