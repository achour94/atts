package com.atts.tools.msystem.application.parsers.consumptions;

import com.atts.tools.msystem.application.parsers.CellReader;
import com.atts.tools.msystem.application.parsers.TableFileType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

@Component
public class XlsxConsumptionsParser extends ConsumptionsParser {

    @Autowired
    public XlsxConsumptionsParser(@Qualifier("xlsx") CellReader cellReader) {
        super(cellReader);
    }

    @Override
    protected TableFileType tableFileType() {
        return TableFileType.XLSX;
    }

    @Override
    public boolean match(TableFileType tableFileType) {
        return TableFileType.XLSX.equals(tableFileType);
    }
}
