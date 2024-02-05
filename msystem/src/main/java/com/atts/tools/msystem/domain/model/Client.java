package com.atts.tools.msystem.domain.model;

import com.atts.tools.msystem.common.config.jackson.ClientReferenceDeserialization;
import com.atts.tools.msystem.common.config.jackson.ClientReferenceSerialization;
import com.atts.tools.msystem.domain.model.types.ClientReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Client implements ModelEntity {

    @JsonProperty("clientId")
    Integer id;
    @JsonSerialize(using = ClientReferenceSerialization.class)
    @JsonDeserialize(using = ClientReferenceDeserialization.class)
    ClientReference clientReference;
    @Builder.Default
    List<Subscription> subscriptions = new ArrayList<>();
    Double defaultSubscription;
    Double diverseSubscription;
    String postalCode;
    String city;
    @Builder.Default
    List<User> users = new ArrayList<>();
    Boolean activeDiverse;
    String name;
    String address;

    @Override
    public String toString() {
        return clientReference.toString();
    }
}
