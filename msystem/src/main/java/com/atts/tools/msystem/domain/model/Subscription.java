package com.atts.tools.msystem.domain.model;

import java.util.Date;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class Subscription {
    private String name;
    private String data;
    private Double price;
}
