package com.atts.tools.msystem.domain.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class User {
    private Integer id;
    private Double diverseAmount;
    private List<Role> roles;
    private String address;
    private String email;
    private String username;
    private String password;
    private String postalCode;
    private String reference;
    private Subscription subscription;
    private Boolean diverse;
    private Integer diverseAmountÍ;
}
