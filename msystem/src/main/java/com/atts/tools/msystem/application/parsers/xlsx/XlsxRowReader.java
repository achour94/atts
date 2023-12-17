package com.atts.tools.msystem.application.parsers.xlsx;

import com.atts.tools.msystem.application.parsers.RowReader;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Row.MissingCellPolicy;

class XlsxRowReader implements RowReader {

    Row row;

    public XlsxRowReader(Row row) {
        this.row = row;
    }

    @Override
    public Object getCell(int index) {
        return row.getCell(index, MissingCellPolicy.RETURN_NULL_AND_BLANK);
    }
}
