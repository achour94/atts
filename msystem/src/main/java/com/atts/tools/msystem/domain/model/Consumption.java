package com.atts.tools.msystem.domain.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Builder
public class Consumption {
    Integer id;
    Integer consumptionDuration;
    Integer consumptionCount;
    ConsumptionType type;
}
