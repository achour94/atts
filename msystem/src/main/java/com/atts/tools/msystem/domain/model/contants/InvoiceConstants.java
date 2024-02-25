package com.atts.tools.msystem.domain.model.contants;

import java.sql.Date;
import java.time.LocalDate;

public class InvoiceConstants {

    private InvoiceConstants() {
        //heler class
    }

    public static final Double TVA = 20.0;
    public static final Boolean DEFAULT_PROFORMA = false;

    public static Date defaultStartPeriod() {
        return Date.valueOf(LocalDate.now().minusMonths(1).withDayOfMonth(1));
    }

    public static Date defaultEndPeriod() {
        return Date.valueOf(LocalDate.now().withDayOfMonth(1).minusDays(1));
    }

}
