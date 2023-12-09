package com.atts.tools.msystem.application.parsers.xlsx;

import com.atts.tools.msystem.application.parsers.xlsx.IntervalCellExtractor;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.Month;
import java.util.ArrayList;
import java.sql.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Row.MissingCellPolicy;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;

@Component
public class StandardXlsxParser {

    Object getCellValue(Cell cell) {
        if (cell == null)
            return null;
        if (cell.getCellType().equals(CellType.BOOLEAN)) {
            return cell.getBooleanCellValue();
        }
        if (cell.getCellType().equals(CellType.STRING)) {
            return cell.getStringCellValue();
        }
        if (cell.getCellType().equals(CellType.NUMERIC)) {
            return cell.getNumericCellValue();
        }
        if (cell.getCellType().equals(CellType.BLANK)) {
            return null;
        }
        throw new IllegalStateException("Unsuported cell type");
    }


    List<IntervalCellExtractor> extractors;

    public StandardXlsxParser() {
        extractors = new ArrayList<>();
        Function<Cell, String> stringExtractor = cell -> {
            Object value = getCellValue(cell);
            if (value == null) {
                return null;
            }
            return String.valueOf(value);
        };
        extractors.add(new IntervalCellExtractor(0, 8, stringExtractor));
        Function<Cell, Double> doubleExtractor = cell -> {
            Object value = getCellValue(cell);
            if (value == null) {
                return null;
            }
            if (value instanceof Double) {
                return (Double) value;
            }
            if (value instanceof String) {
                return Double.valueOf((String) value);
            }
            throw new IllegalStateException("You cannot convert " + cell.getCellType().name() + " to double!");
        };
        extractors.add(new IntervalCellExtractor(8, 11, doubleExtractor));
        extractors.add(new IntervalCellExtractor(11, 12, stringExtractor));
        extractors.add(new IntervalCellExtractor(12, 13, doubleExtractor));
        Function<Cell, Date> dateExtractor = cell -> {
            Object value = getCellValue(cell);
            if (value == null) {
                return null;
            }
            if (value instanceof Double) {
                return Date.valueOf(LocalDate.of(1899, Month.DECEMBER, 30).plusDays(((Double) value).longValue()));
            }
            if (value instanceof Date) {
                return (Date) value;
            }

            throw new IllegalStateException("You cannot convert " + cell.getCellType().name() + " to date!");
        };
        extractors.add(new IntervalCellExtractor(13, 15, dateExtractor));
        extractors.add(new IntervalCellExtractor(15, 16, doubleExtractor));
        extractors.add(new IntervalCellExtractor(16, 17, stringExtractor));
        extractors.add(new IntervalCellExtractor(17, 18, doubleExtractor));
        extractors.add(new IntervalCellExtractor(18, 22, stringExtractor));
    }

    public List<List<Object>> extractXlsxRows(InputStream is) throws IOException {
        List<List<Object>> result = new ArrayList<>();
        XSSFWorkbook workbook = new XSSFWorkbook(is);
        XSSFSheet firstSheet = workbook.getSheetAt(0);
        Iterator<Row> rowIterator = firstSheet.rowIterator();

        //skip header row
        rowIterator.next();

        while (rowIterator.hasNext()) {
            Row row = rowIterator.next();
            List<Object> rowList = new ArrayList<>();
            for (int cellNumber = 0; cellNumber <= 21; ++cellNumber) {
                Cell cell = row.getCell(cellNumber, MissingCellPolicy.RETURN_NULL_AND_BLANK);
                int currentIndex = cellNumber;
                Optional<IntervalCellExtractor> intervalCellExtractor = extractors.stream()
                    .filter(extractor -> extractor.matchInterval(currentIndex)).findAny();
                if (intervalCellExtractor.isPresent()) {
                    rowList.add(intervalCellExtractor.get().extract(cell));
                } else {
                    throw new IllegalStateException("Bad configuration for interval cell extractors!");
                }
            }
            if (rowList.stream().filter(col -> col != null).findAny().isEmpty())
                break;
            result.add(rowList);
        }
        return result;

    }
}
