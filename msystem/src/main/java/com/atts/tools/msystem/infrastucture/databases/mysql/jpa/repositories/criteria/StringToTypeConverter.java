package com.atts.tools.msystem.infrastucture.databases.mysql.jpa.repositories.criteria;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class StringToTypeConverter {

    public static Double toDouble(String value) {
        return Double.valueOf(value);
    }

    public static LocalDate toLocalDate(String value) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        return LocalDate.parse(value, formatter);
    }

    public static Integer toInteger(String value) {
        return Integer.valueOf(value);
    }

    public static Comparable toComparableType(String value, Class clazz) {
        if (clazz.equals(LocalDate.class)) {
            return toLocalDate(value);
        } else if (clazz.equals(Double.class)) {
            return toDouble(value);
        } else if (clazz.equals(String.class)) {
            return value;
        } else if (clazz.equals(Integer.class)) {
            return toInteger(value);
        }
        return null;
    }

}
