package com.atts.tools.msystem.application.parsers;

import java.util.Arrays;

public enum TableFileType {
    CSV,
    XLSX;

    public static TableFileType convert(String filename) {
        return Arrays.stream(TableFileType.values()).filter(val -> {
            String fileType = filename.substring(filename.lastIndexOf(".") + 1);
            return val.name().equalsIgnoreCase(fileType);
        }).findAny().orElseThrow(IllegalStateException::new);
    }
}
