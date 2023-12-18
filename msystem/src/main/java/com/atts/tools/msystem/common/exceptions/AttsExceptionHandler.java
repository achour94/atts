package com.atts.tools.msystem.common.exceptions;

import com.atts.tools.msystem.common.exceptions.types.AttsException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class AttsExceptionHandler {
    DateTimeFormatter format = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");

    @ExceptionHandler(value = AttsException.class)
    public ResponseEntity<Object> handleConflictUsername(
        AttsException ex, WebRequest request) {

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now().format(format));
        if (ex.getMessage() != null) {
            body.put("message", ex.getMessage());
        }

        return new ResponseEntity<>(body, ex.getStatus());
    }
}
