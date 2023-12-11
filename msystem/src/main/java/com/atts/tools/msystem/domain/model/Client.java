package com.atts.tools.msystem.domain.model;

import com.atts.tools.msystem.domain.model.types.ClientReference;
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
    ClientReference clientReference;
    List<Subscription> subscriptions;
    Double defaultSubscription;
    Double diverseSubscription;
    String postalCode;
    String phone;
    String city;
    Boolean activeDiverse;
    String name;
    String address;
    String email;
}
