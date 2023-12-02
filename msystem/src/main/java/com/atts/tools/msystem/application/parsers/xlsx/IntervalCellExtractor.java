package com.atts.tools.msystem.application.parsers.xlsx;

import java.util.Objects;
import java.util.function.Function;
import org.apache.poi.ss.usermodel.Cell;

public class IntervalCellExtractor {
    int start;
    int end;
    Function<Cell, ?> cellExtractor;

    public IntervalCellExtractor(int start, int end, Function<Cell, ?> cellExtractor) {
        if (start > end) {
            throw new IllegalStateException("You should have start <= end");
        }
        this.start = start;
        this.end = end;
        this.cellExtractor = cellExtractor;
    }

    public Object extract(Cell cell) {
        return cellExtractor.apply(cell);
    }

    public boolean matchInterval(int cellNr) {
        return start <= cellNr && cellNr < end;
    }
}
