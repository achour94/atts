package com.atts.tools.msystem.application.parsers.csv;

import com.atts.tools.msystem.application.parsers.CellReader;
import org.springframework.stereotype.Component;

@Component("csv")
public class CsvCellReader implements CellReader {

    @Override
    public Object readCell(Object cell) {
        return cell;
    }
}
