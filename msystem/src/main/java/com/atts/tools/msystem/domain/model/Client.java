package com.atts.tools.msystem.domain.model;

import com.atts.tools.msystem.domain.model.types.ClientReference;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class Client implements ModelEntity{
    Integer id;
    ClientReference clientReference;
    Double defaultSubscription;
    Double diverseSubscription;
    String postalCode;
    Boolean activeDiverse;
    String name;
    String address;
    String email;
}
