package com.atts.tools.msystem.domain.model;

import com.atts.tools.msystem.domain.model.enums.InvoiceStatus;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.sql.Date;
import java.util.List;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Invoice implements ModelEntity {

    Client client;
    Boolean proforma;
    Boolean specialNumbers;
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
