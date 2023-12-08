package com.atts.tools.msystem.domain.services.processors;
//LogType Invoice,CLient,General
//Invoice - processing errors - error, [emails, delete published invoice] - information
//Client - processing invoices (information about the client are missing), delete client
//Logs - message, type, severity, date

public record ProcessError(Integer lineNr, String message) {
}
