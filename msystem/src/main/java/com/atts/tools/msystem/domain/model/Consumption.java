package com.atts.tools.msystem.domain.model;

import java.sql.Date;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Builder
public class Consumption {
    Integer id;
    Integer consumptionDuration;
    Integer consumptionCount;
    Date startDate;
    Date endDate;
    Double htAmount;
    ConsumptionType type;
}
