package com.atts.tools.msystem.application.parsers.xlsx;

import com.atts.tools.msystem.application.parsers.RowReader;
import com.atts.tools.msystem.application.parsers.TableReader;
import java.io.IOException;
import java.io.InputStream;
import java.util.Iterator;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

public class XlsxTableReader implements TableReader {

    Iterator<Row> iterator;

    public XlsxTableReader(InputStream inputStream) throws IOException {
        XSSFWorkbook workbook = new XSSFWorkbook(inputStream);
        XSSFSheet firstSheet = workbook.getSheetAt(0);
        iterator = firstSheet.rowIterator();
    }

    @Override
    public boolean hasNext() {
        return iterator.hasNext();
    }

    @Override
    public RowReader next() {
        return new XlsxRowReader(iterator.next());
    }
}
