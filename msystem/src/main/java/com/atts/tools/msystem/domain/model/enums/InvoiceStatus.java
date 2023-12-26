package com.atts.tools.msystem.domain.model.enums;

import java.util.Arrays;

public enum InvoiceStatus {
    DRAFT,
    SHARED;

    public static InvoiceStatus convert(String status) throws IllegalAccessException {
        if (status == null)
            return null;
        return Arrays.stream(InvoiceStatus.values()).filter(enumEl -> enumEl.name().equals(status)).findAny()
            .orElseThrow(IllegalAccessException::new);
    }
}
