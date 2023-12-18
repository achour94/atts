package com.atts.tools.msystem.common.config.jackson;

import com.atts.tools.msystem.domain.model.ConsumptionType;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import java.io.IOException;

public class EnumWithLabelSerialization extends JsonSerializer<ConsumptionType> {

    @Override
    public void serialize(ConsumptionType consumptionType, JsonGenerator jsonGenerator,
        SerializerProvider serializerProvider) throws IOException {
        jsonGenerator.writeString(consumptionType.getLabel());
    }
}
