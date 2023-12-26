package com.atts.tools.msystem.domain.model;

import com.fasterxml.jackson.annotation.JsonProperty;
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
public class Subscription {
    @JsonProperty("subscriptionId")
    Integer id;
    private String name;
    private String data;
    private Double price;
    private Client client;

}
