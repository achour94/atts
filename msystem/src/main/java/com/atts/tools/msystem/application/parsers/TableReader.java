package com.atts.tools.msystem.application.parsers;

public interface TableReader {
    boolean hasNext();
    RowReader next();
}
