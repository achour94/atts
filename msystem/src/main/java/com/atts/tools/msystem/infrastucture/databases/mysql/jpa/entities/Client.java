package com.atts.tools.msystem.infrastucture.databases.mysql.jpa.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "client")
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "default_subscription")
    private Double defaultSubscription;

    @Size(max = 45)
    @Column(name = "reference", length = 45)
    private String reference;

    @Size(max = 45)
    @Column(name = "postal_code", length = 45)
    private String postalCode;

    @Size(max = 45)
    @Column(name = "email", length = 45)
    private String email;

    @Column(name = "diverse")
    private Byte diverse;

    @Column(name = "diverse_amount")
    private Double diverseAmount;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @OneToMany(mappedBy = "client")
    private Set<Invoice> invoices = new LinkedHashSet<>();

    @OneToMany(mappedBy = "client")
    private Set<Subscription> subscriptions = new LinkedHashSet<>();

    @OneToMany(mappedBy = "client")
    private Set<User> users = new LinkedHashSet<>();

}
