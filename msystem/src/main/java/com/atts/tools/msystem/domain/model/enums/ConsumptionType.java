package com.atts.tools.msystem.domain.model.enums;

import java.util.Arrays;

public enum ConsumptionType {
    CDR_MOBILES("CDR Mobiles"),
    CDR_NATIONAUX("CDR Nationaux'"),
    CDR_internationaux("CDR Internationaux'"),
    CDR_SVA_A("CDR SVA A"),
    CDR_SVA_B("CDR SVA B"),
    CDR_SVA_D("CDR SVA D"),
    ABONAMENT_PERIODIQUE("Abonnement périodique");

    private final String label;

    ConsumptionType(String label) {
        this.label = label;
    }

    public String getLabel() {
        return this.label;
    }

    public static ConsumptionType convertFromLabel(String type) throws IllegalAccessException {
        return Arrays.stream(ConsumptionType.values()).filter(enumEl -> enumEl.label.equals(type)).findAny()
            .orElseThrow(IllegalAccessException::new);
    }

    public static ConsumptionType convertFromName(String type) throws IllegalAccessException {
        return Arrays.stream(ConsumptionType.values()).filter(enumEl -> enumEl.name().equals(type)).findAny()
            .orElseThrow(IllegalAccessException::new);
    }

    public static Boolean isResetableConsumption(ConsumptionType consumptionType) {
        return CDR_internationaux.equals(consumptionType) || CDR_NATIONAUX.equals(consumptionType)
            || CDR_MOBILES.equals(consumptionType);
    }

}
