package com.atts.tools.msystem.application.parsers;

import com.atts.tools.msystem.common.exceptions.types.IlegalRequestException;
import java.util.Arrays;

public enum TableFileType {
    CSV,
    XLSX;

    public static TableFileType convert(String filename) throws IlegalRequestException {
        String fileType = filename.substring(filename.lastIndexOf(".") + 1);
        return Arrays.stream(TableFileType.values()).filter(val -> val.name().equalsIgnoreCase(fileType)).findAny()
            .orElseThrow(() -> new IlegalRequestException("We don't support the following file type " + fileType));
    }
}
