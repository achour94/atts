package com.atts.tools.msystem.common.config.jackson;

import com.atts.tools.msystem.domain.model.types.ClientReference;
import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import java.io.IOException;

public class ClientReferenceDeserialization extends JsonDeserializer<ClientReference> {

    @Override
    public ClientReference deserialize(JsonParser jsonParser, DeserializationContext deserializationContext)
        throws IOException, JacksonException {
        JsonNode node = jsonParser.getCodec().readTree(jsonParser);
        return new ClientReference(node.asText());
    }
}
