package com.atts.tools.msystem.infrastucture.databases.mysql.jpa.utils;

import com.atts.tools.msystem.domain.model.Client;
import com.atts.tools.msystem.domain.model.Consumption;
import com.atts.tools.msystem.domain.model.ConsumptionType;
import com.atts.tools.msystem.domain.model.Invoice;
import com.atts.tools.msystem.domain.model.InvoiceStatus;
import com.atts.tools.msystem.domain.model.Subscription;
import com.atts.tools.msystem.domain.model.User;
import com.atts.tools.msystem.domain.model.types.ClientReference;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.entities.ClientEntity;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.entities.ConsumptionEntity;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.entities.InvoiceEntity;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.entities.SubscriptionEntity;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.entities.UserEntity;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.repositories.ClientRepository;
import java.sql.Date;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class Transformer {

    private final ClientRepository clientRepository;

    public UserEntity transformToUserEntity(
        User user) {
        UserEntity userEntity = new UserEntity();
        userEntity.setEmail(user.getEmail());
        userEntity.setUsername(user.getUsername());
        return userEntity;
    }

    public static String columnMapper(String column) {
        if (column.equals("invoiceNumber")) {
            return "id";
        } else if (column.equals("creationDate")) {
            return "createdAt";
        }
        return column;
    }

    public User transformToUser(
        UserEntity userEntity) {
        return User.builder().username(userEntity.getUsername()).id(userEntity.getId()).email(userEntity.getEmail())
            .client(transformToClient(userEntity.getClient()))
            .build();
    }

    public Invoice transformToInvoice(InvoiceEntity entity) {
        //TODO add all fields for invoice
        try {
            return Invoice.builder().startPeriod(Date.valueOf(entity.getStartPeriod()))
                .endPeriod(Date.valueOf(entity.getEndPeriod())).invoiceNumber(entity.getId())
                .client(transformToClient(entity.getClient()))
                .httAmount(entity.getHtAmount())
                .ttcAmount(entity.getTtcAmount())
                .proforma(entity.getProforma() == 1)
                .tva(entity.getTva())
                .status(InvoiceStatus.convert(entity.getStatus()))
                .fileUri(entity.getFileUri())
                .consumptions(
                    entity.getConsumptions().stream().map(this::transformToConsumption).collect(Collectors.toList()))
                .creationDate(entity.getCreatedAt() != null ? Date.valueOf(
                    LocalDate.ofInstant(entity.getCreatedAt(), ZoneId.of("Europe/Paris"))) : null).build();
        } catch (IllegalAccessException e) {
            throw new RuntimeException(e);
        }
    }

    public Consumption transformToConsumption(ConsumptionEntity entity) {
        try {
            return Consumption.builder().consumptionCount(entity.getCount()).consumptionDuration(entity.getDuration())
                .startDate(Date.valueOf(entity.getStartPeriod())).endDate(Date.valueOf(entity.getEndPeriod()))
                .type(ConsumptionType.convert(entity.getType()))
                .htAmount(entity.getHtAmount())
                .build();
        } catch (IllegalAccessException e) {
            throw new RuntimeException(e);
        }
    }

    public Subscription transformToSubscription(SubscriptionEntity subscriptionEntity) {
        return transformToSubscriptionWithRel(subscriptionEntity, true);
    }

    public Subscription transformToSubscriptionWithRel(SubscriptionEntity subscriptionEntity, boolean addClient) {
        Subscription subscription = Subscription.builder().id(subscriptionEntity.getId()).name(subscriptionEntity.getName())
            .data(subscriptionEntity.getData()).price(
                subscriptionEntity.getPrice()).build();
        if (addClient) {
            subscription.setClient(transformToClient(subscriptionEntity.getClient()));
        }
        return subscription;
    }

    public Subscription transformToSubscriptionWithoutClient(SubscriptionEntity subscriptionEntity) {
        return transformToSubscriptionWithRel(subscriptionEntity, false);
    }

    public SubscriptionEntity transformToSubscriptionEntity(Subscription subscription) {
        return transformToSubscriptionEntityWithRel(subscription, true);
    }

    public SubscriptionEntity transformToSubscriptionEntityWithRel(Subscription subscription, boolean addClient) {
        if (subscription == null)
            return null;
        SubscriptionEntity entity = new SubscriptionEntity();
        if (addClient) {
            entity.setClient(transformToClientEntity(subscription.getClient()));
        }
        entity.setData(subscription.getData());
        entity.setPrice(subscription.getPrice());
        entity.setId(subscription.getId());
        entity.setName(subscription.getName());
        return entity;
    }

    public SubscriptionEntity transformToSubscriptionEntityLazyClient(Subscription subscription) {
        return transformToSubscriptionEntityWithRel(subscription, false);
    }

    public ConsumptionEntity transformToConsumptionEntity(Consumption consumption) {
        ConsumptionEntity consumptionEntity = new ConsumptionEntity();
        consumptionEntity.setCount(consumption.getConsumptionCount());
        consumptionEntity.setId(consumption.getId());
        consumptionEntity.setDuration(consumption.getConsumptionDuration());
        consumptionEntity.setType(consumption.getType().getLabel());
        consumptionEntity.setStartPeriod(consumption.getStartDate().toLocalDate());
        consumptionEntity.setEndPeriod(consumption.getEndDate().toLocalDate());
        consumptionEntity.setHtAmount(consumption.getHtAmount());
        return consumptionEntity;
    }

    public Client transformToClient(ClientEntity clientEntity) {
        if (clientEntity == null) {
            return null;
        }
        return Client.builder().id(clientEntity.getId())
            .clientReference(new ClientReference(clientEntity.getReference()))
            .defaultSubscription(clientEntity.getDefaultSubscription())
            .activeDiverse(clientEntity.getDiverse() == 1).email(clientEntity.getEmail())
            .address(clientEntity.getAddress())
            .name(clientEntity.getName())
            .subscriptions(clientEntity.getSubscriptions().stream().map(this::transformToSubscriptionWithoutClient).collect(
                Collectors.toList()))
            .diverseSubscription(clientEntity.getDiverseAmount())
            .postalCode(clientEntity.getPostalCode()).build();
    }

    public ClientEntity transformToClientEntity(Client client) {
        if (client == null)
            return null;
        ClientEntity entity = new ClientEntity();
        entity.setId(client.getId());
        entity.setDefaultSubscription(client.getDefaultSubscription());
        entity.setDiverseAmount(client.getDiverseSubscription());
        entity.setPostalCode(client.getPostalCode());
        entity.setDiverse(Integer.valueOf(client.getActiveDiverse() ? 1 : 0).byteValue());
        entity.setEmail(client.getEmail());
        entity.setName(client.getName());
        entity.setReference(client.getClientReference().reference());
        entity.setSubscriptions(client.getSubscriptions().stream().map(this::transformToSubscriptionEntityLazyClient).collect(
            Collectors.toSet()));
        entity.setAddress(client.getAddress());
        return entity;
    }


    public InvoiceEntity transformToInvoiceEntity(Invoice invoice) {
        InvoiceEntity invoiceEntity = new InvoiceEntity();
        invoiceEntity.setClient(
            clientRepository.findClientByReference(invoice.getClient().getClientReference().reference()).get());
        invoiceEntity.setStartPeriod(invoice.getStartPeriod().toLocalDate());
        invoiceEntity.setEndPeriod(invoice.getEndPeriod().toLocalDate());
        invoiceEntity.getConsumptions().addAll(
            invoice.getConsumptions().stream().map(this::transformToConsumptionEntity).collect(
                Collectors.toSet()));
        invoiceEntity.setHtAmount(invoice.getHttAmount());
        invoiceEntity.setTtcAmount(invoice.getTtcAmount());
        invoiceEntity.setProforma((byte) (invoice.getProforma() ? 1 : 0));
        invoiceEntity.setFileUri(invoice.getFileUri());
        invoiceEntity.setTva(invoice.getTva());
        invoiceEntity.setId(invoice.getInvoiceNumber());
        if (invoice.getStatus() != null) {
            invoiceEntity.setStatus(invoice.getStatus().name());
        }
        return invoiceEntity;
    }

}
