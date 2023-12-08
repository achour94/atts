package com.atts.tools.msystem.domain.model;

import com.atts.tools.msystem.domain.model.types.ClientReference;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class Client implements ModelEntity{
    Integer id;
    ClientReference clientReference;
    List<Subscription> subscriptionList;
    Double defaultSubscription;
    Double diverseSubscription;
    String postalCode;
    Boolean activeDiverse;
    String name;
    String address;
    String email;
}
