package com.atts.tools.msystem.application.parsers;

import java.util.function.Function;

public class IntervalCellExtractor {
    int start;
    int end;
    Function<Object, Object> cellExtractor;

    public IntervalCellExtractor(int start, int end, Function<Object, Object> cellExtractor) {
        if (start > end) {
            throw new IllegalStateException("You should have start <= end");
        }
        this.start = start;
        this.end = end;
        this.cellExtractor = cellExtractor;
    }

    public Object extract(Object cell) {
        return cellExtractor.apply(cell);
    }

    public boolean matchInterval(int cellNr) {
        return start <= cellNr && cellNr < end;
    }
}
