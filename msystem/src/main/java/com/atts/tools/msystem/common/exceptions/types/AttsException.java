package com.atts.tools.msystem.common.exceptions.types;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class AttsException extends Exception {

    private final HttpStatus status;

    public AttsException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public AttsException(HttpStatus status) {
        super();
        this.status = status;
    }
}
