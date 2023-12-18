package com.atts.tools.msystem.application.parsers.consumptions;

import com.atts.tools.msystem.application.parsers.CellReader;
import com.atts.tools.msystem.application.parsers.IntervalCellExtractor;
import com.atts.tools.msystem.application.parsers.RowReader;
import com.atts.tools.msystem.application.parsers.TableFileType;
import com.atts.tools.msystem.application.parsers.TableReader;
import com.atts.tools.msystem.application.parsers.TableReaderFactory;
import com.atts.tools.msystem.common.exceptions.ErrorMessageUtil;
import com.atts.tools.msystem.common.exceptions.types.IlegalRequestException;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.Month;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.sql.Date;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Function;

public abstract class ConsumptionsParser {

    List<IntervalCellExtractor> extractors;

    public ConsumptionsParser(CellReader cellReader) {
        extractors = new ArrayList<>();
        Function<Object, Object> stringExtractor = cell -> {
            Object value = cellReader.readCell(cell);
            if (value == null) {
                return null;
            }
            return String.valueOf(value);
        };
        extractors.add(new IntervalCellExtractor(0, 8, stringExtractor));
        Function<Object, Object> doubleExtractor = cell -> {
            Object value = cellReader.readCell(cell);
            if (value == null) {
                return null;
            }
            if (value instanceof Double) {
                return (Double) value;
            }
            if (value instanceof String) {
                if(((String) value).isEmpty())
                    return null;
                return Double.valueOf((String) value);
            }
            throw new IllegalStateException("You cannot convert " + value + " to double!");
        };
        extractors.add(new IntervalCellExtractor(8, 11, doubleExtractor));
        extractors.add(new IntervalCellExtractor(11, 12, stringExtractor));
        extractors.add(new IntervalCellExtractor(12, 13, doubleExtractor));
        Function<Object, Object> dateExtractor = cell -> {
            Object value = cellReader.readCell(cell);
            if (value == null) {
                return null;
            }
            if (value instanceof Double) {
                return Date.valueOf(LocalDate.of(1899, Month.DECEMBER, 30).plusDays(((Double) value).longValue()));
            }
            if (value instanceof Date) {
                return (Date) value;
            }

            if (value instanceof String) {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
                LocalDate localDate = LocalDate.parse((String) value, formatter);
                return Date.valueOf(localDate);
            }

            throw new IllegalStateException("You cannot convert " + value + " to date!");
        };
        extractors.add(new IntervalCellExtractor(13, 15, dateExtractor));
        extractors.add(new IntervalCellExtractor(15, 16, doubleExtractor));
        extractors.add(new IntervalCellExtractor(16, 17, stringExtractor));
        extractors.add(new IntervalCellExtractor(17, 18, doubleExtractor));
        extractors.add(new IntervalCellExtractor(18, 22, stringExtractor));
    }

    public List<List<Object>> extractRows(InputStream is) throws IOException, IlegalRequestException {
        List<List<Object>> result = new ArrayList<>();
        TableReader tableReader = TableReaderFactory.create(is, tableFileType());
        //skip header
        tableReader.next();

        while (tableReader.hasNext()) {
            RowReader row = tableReader.next();
            List<Object> rowList = new ArrayList<>();
            for (int cellNumber = 0; cellNumber <= 21; ++cellNumber) {
                Object cell = row.getCell(cellNumber);
                int finalCellNumber = cellNumber;
                Optional<IntervalCellExtractor> intervalCellExtractor = extractors.stream()
                    .filter(extractor -> extractor.matchInterval(finalCellNumber)).findAny();
                if (intervalCellExtractor.isPresent()) {
                    rowList.add(intervalCellExtractor.get().extract(cell));
                } else {
                    throw new IlegalRequestException(ErrorMessageUtil.fileTableColumnsConfigurationIsBad());
                }
            }
            if (rowList.stream().filter(Objects::nonNull).findAny().isEmpty()) {
                break;
            }
            result.add(rowList);
        }
        return result;

    }

    protected abstract TableFileType tableFileType();

    public abstract boolean match(TableFileType tableFileType);
}
