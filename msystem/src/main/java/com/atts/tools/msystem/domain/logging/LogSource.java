package com.atts.tools.msystem.domain.logging;

import java.util.Arrays;

public enum LogSource {
    INVOICE,
    INVOICE_FILE_PROCESSING,
    CLIENT,
    USER,
    GENERAL,
    EMAIL;

    public static LogSource convert(String type) throws IllegalAccessException {
        return Arrays.stream(LogSource.values()).filter(enumEl -> enumEl.name().equals(type)).findAny()
            .orElseThrow(IllegalAccessException::new);
    }
}
