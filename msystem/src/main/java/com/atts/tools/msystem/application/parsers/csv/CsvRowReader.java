package com.atts.tools.msystem.application.parsers.csv;

import com.atts.tools.msystem.application.parsers.RowReader;
import org.apache.commons.csv.CSVRecord;

public class CsvRowReader implements RowReader {

    CSVRecord record;

    public CsvRowReader(CSVRecord record) {
        this.record = record;
    }

    @Override
    public Object getCell(int index) {
        return record.get(index);
    }
}
