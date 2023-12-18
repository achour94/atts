package com.atts.tools.msystem.common.exceptions;

public class ErrorMessageUtil {

    private ErrorMessageUtil() {
    }

    public static String clientWithIdNotFound(Integer id) {
        return String.format("We cannot found a client with id %s", id);
    }

    public static String invoiceWithIdNotFound(Integer id) {
        return String.format("We cannot found an invoice with id %s", id);
    }

    public static String fileTableColumnsConfigurationIsBad() {
        return "Table's column from your file is bad!";
    }
}
