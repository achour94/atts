package com.atts.tools.msystem.domain.model;

import com.atts.tools.msystem.domain.model.enums.InvoiceStatus;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.sql.Date;
import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class Invoice implements ModelEntity {

    Client client;
    Boolean proforma;
    Date creationDate; //first time is inserted by database automatically
    String fileUri;
    Date startPeriod;
    InvoiceStatus status;
    Date endPeriod;
    Double htAmount;
    Double tva;
    Double ttcAmount;
    @JsonProperty("invoiceNumber")
    Integer id; //id
    List<Consumption> consumptions;
}
