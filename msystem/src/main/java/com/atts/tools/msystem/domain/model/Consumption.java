package com.atts.tools.msystem.domain.model;

import com.atts.tools.msystem.common.config.jackson.EnumWithLabelSerialization;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import java.sql.Date;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class Consumption {

    Integer id;
    Integer consumptionDuration;
    Integer consumptionCount;
    Date startDate;
    Date endDate;
    Double htAmount;
    @JsonSerialize(using = EnumWithLabelSerialization.class)
    ConsumptionType type;
}
