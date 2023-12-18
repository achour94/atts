package com.atts.tools.msystem.common.exceptions.types;

import org.springframework.http.HttpStatus;

public class IlegalRequestException extends AttsException {

    public IlegalRequestException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }

    public IlegalRequestException() {
        super(HttpStatus.BAD_REQUEST);
    }
}
