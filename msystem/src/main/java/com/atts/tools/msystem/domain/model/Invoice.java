package com.atts.tools.msystem.domain.model;

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
    Date endPeriod;
    Double httAmount;
    Double tva;
    Double ttcAmount;
    Integer invoiceNumber; //id
    List<Consumption> consumptions;
}
