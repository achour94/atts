package com.atts.tools.msystem.application.parsers.csv;

import com.atts.tools.msystem.application.parsers.RowReader;
import com.atts.tools.msystem.application.parsers.TableReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Iterator;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;

public class CsvTableReader implements TableReader {

    Iterator<CSVRecord> rowIterator;

    public CsvTableReader(InputStream inputStream) throws IOException {
        CSVParser csvParser = new CSVParser(new InputStreamReader(inputStream), CSVFormat.DEFAULT);
        rowIterator = csvParser.iterator();
    }

    @Override
    public boolean hasNext() {
        return rowIterator.hasNext();
    }

    @Override
    public RowReader next() {
        return new CsvRowReader(rowIterator.next());
    }
}
