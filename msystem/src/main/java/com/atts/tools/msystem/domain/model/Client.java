package com.atts.tools.msystem.domain.model;

import com.atts.tools.msystem.common.config.jackson.ClientReferenceSerialization;
import com.atts.tools.msystem.domain.model.types.ClientReference;
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

    Integer id;
    @JsonSerialize(using = ClientReferenceSerialization.class)
    ClientReference clientReference;
    @Builder.Default
    List<Subscription> subscriptions = new ArrayList<>();
    Double defaultSubscription;
    Double diverseSubscription;
    String postalCode;
    String phone;
    String city;
    @Builder.Default
    List<User> users = new ArrayList<>();
    Boolean activeDiverse;
    String name;
    String address;
    String email;
}
