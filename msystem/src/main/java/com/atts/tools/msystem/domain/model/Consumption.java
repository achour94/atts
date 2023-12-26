package com.atts.tools.msystem.domain.model;

import com.atts.tools.msystem.common.config.jackson.ConsumptionTypeSerializer;
import com.atts.tools.msystem.domain.model.enums.ConsumptionType;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import java.sql.Date;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class Consumption {

    @JsonProperty("consumptionId")
    Integer id;
    Integer consumptionDuration;
    Integer consumptionCount;
    Date startDate;
    Date endDate;
    Double htAmount;
    @JsonSerialize(using = ConsumptionTypeSerializer.class)
    ConsumptionType type;
}
