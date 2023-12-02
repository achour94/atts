package com.atts.tools.msystem.infrastucture.databases.mysql.jpa.repositories.criteria;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class StringToTypeConverter {

    public static Double toDouble(String value) {
        return Double.valueOf(value);
    }

    public static LocalDate toLocalDate(String value) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        return LocalDate.parse(value, formatter);
    }

    public static Comparable toComparableType(String value, Class clazz) {
        if (clazz.equals(LocalDate.class)) {
            return toLocalDate(value);
        } else if (clazz.equals(Integer.class)) {
            return toDouble(value);
        }
        return null;
    }

}
