package com.atts.tools.msystem.common.exceptions.types;

import org.springframework.http.HttpStatus;

public class RegistrationException extends AttsException {

    public RegistrationException(String message) {
        super(message, HttpStatus.CONFLICT);
    }
}
