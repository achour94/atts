package com.atts.tools.msystem.common.config.jackson;

import com.atts.tools.msystem.domain.model.types.ClientReference;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import java.io.IOException;

public class ClientReferenceSerialization extends JsonSerializer<ClientReference> {

    @Override
    public void serialize(ClientReference clientReference, JsonGenerator jsonGenerator,
        SerializerProvider serializerProvider) throws IOException {
        jsonGenerator.writeString(clientReference.reference());
    }
}
