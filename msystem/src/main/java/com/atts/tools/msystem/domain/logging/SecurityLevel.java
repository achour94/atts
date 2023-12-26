package com.atts.tools.msystem.domain.logging;

import java.util.Arrays;

public enum SecurityLevel {
    ERROR,
    WARNING,
    INFO;

    public static SecurityLevel convert(String type) throws IllegalAccessException {
        return Arrays.stream(SecurityLevel.values()).filter(enumEl -> enumEl.name().equals(type)).findAny()
            .orElseThrow(IllegalAccessException::new);
    }
}
