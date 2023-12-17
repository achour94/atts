package com.atts.tools.msystem.application.parsers;

import com.atts.tools.msystem.application.parsers.csv.CsvTableReader;
import com.atts.tools.msystem.application.parsers.xlsx.XlsxTableReader;
import java.io.IOException;
import java.io.InputStream;

public class TableReaderFactory {

    public static TableReader create(InputStream is, TableFileType type) throws IOException {
        return switch (type) {
            case CSV -> new CsvTableReader(is);
            case XLSX -> new XlsxTableReader(is);
        };
    }
}
