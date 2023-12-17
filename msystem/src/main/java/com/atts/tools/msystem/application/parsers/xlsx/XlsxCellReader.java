package com.atts.tools.msystem.application.parsers.xlsx;

import com.atts.tools.msystem.application.parsers.CellReader;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.springframework.stereotype.Component;

@Component("xlsx")
public class XlsxCellReader implements CellReader {

    @Override
    public Object readCell(Object cellObject) {
        if (cellObject == null)
            return null;
        if (cellObject instanceof Cell cell) {
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
            throw new IllegalStateException("Unsupported cell type");
        }
        throw new UnsupportedOperationException();
    }
}
