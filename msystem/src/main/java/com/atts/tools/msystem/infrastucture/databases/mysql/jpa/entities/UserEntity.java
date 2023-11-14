package com.atts.tools.msystem.infrastucture.databases.mysql.jpa.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
import java.util.LinkedHashSet;
import java.util.Set;
import lombok.Generated;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "user")
public class UserEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id", nullable = false)
  private Integer id;

  @Size(max = 45)
  @Column(name = "username", length = 45)
  private String username;

  @Size(max = 45)
  @Column(name = "email", length = 45)
  private String email;

  @Size(max = 45)
  @Column(name = "reference", length = 45)
  private String reference;

  @Column(name = "diverse")
  private Byte diverse;

  @Size(max = 45)
  @Column(name = "diverse_amount", length = 45)
  private String diverseAmount;

  @Size(max = 45)
  @Column(name = "phone_number", length = 45)
  private String phoneNumber;

  @Size(max = 45)
  @Column(name = "address", length = 45)
  private String address;

  @ManyToMany(mappedBy = "users")
  private Set<Subscription> subscriptions = new LinkedHashSet<>();

}