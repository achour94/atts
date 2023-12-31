package com.atts.tools.msystem.domain.services.processors;

import com.atts.tools.msystem.domain.model.Consumption;
import java.sql.Date;
import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ClientSummary {
    List<Consumption> consumptions;
    Double tva;
    String name;
    String email;
    String address;
}
