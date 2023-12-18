package com.atts.tools.msystem.common.exceptions.types;

import org.springframework.http.HttpStatus;

public class NotFoundElementException extends AttsException {

    public NotFoundElementException(String message) {
        super(message, HttpStatus.NOT_FOUND);
    }

    public NotFoundElementException() {
        super(HttpStatus.NOT_FOUND);
    }
}
