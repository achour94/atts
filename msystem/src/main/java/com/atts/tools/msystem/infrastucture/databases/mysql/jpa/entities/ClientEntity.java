package com.atts.tools.msystem.infrastucture.databases.mysql.jpa.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Objects;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Getter
@Setter
@Entity
@Table(name = "client")
public class ClientEntity implements Comparable, DBEntity {

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
    @Column(name = "name", length = 45)
    private String name;

    @Size(max = 100)
    @Column(name = "address", length = 45)
    private String address;

    @Size(max = 45)
    @Column(name = "postal_code", length = 45)
    private String postalCode;

    @Size(max = 45)
    @Column(name = "city", length = 45)
    private String city;

    @Column(name = "diverse")
    private Byte diverse;

    @Column(name = "diverse_amount")
    private Double diverseAmount;

    @CreationTimestamp
    @Column(name = "created_at")
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    @OneToMany(mappedBy = "client")
    private Set<InvoiceEntity> invoiceEntities;

    @OneToMany(mappedBy = "client", fetch = FetchType.LAZY)
    private Set<SubscriptionEntity> subscriptions;

    @OneToMany(mappedBy = "client")
    private Set<UserEntity> users;

    @Override
    public int compareTo(Object o) {
        return this.name.compareTo(((ClientEntity)o).getName()) ;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        ClientEntity that = (ClientEntity) o;
        return that.name.equals(that.name);
    }

}
