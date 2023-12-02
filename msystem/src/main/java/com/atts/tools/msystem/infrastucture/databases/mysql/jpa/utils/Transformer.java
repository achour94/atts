package com.atts.tools.msystem.infrastucture.databases.mysql.jpa.utils;

import com.atts.tools.msystem.domain.model.Client;
import com.atts.tools.msystem.domain.model.Invoice;
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

    public User transformToUser(
        UserEntity userEntity) {
        return User.builder().username(userEntity.getUsername()).id(userEntity.getId()).email(userEntity.getEmail())
            .build();
    }

    public Invoice transformToInvoice(InvoiceEntity entity) {
        //TODO add all fields for invoice
        return Invoice.builder().startPeriod(Date.valueOf(entity.getStartPeriod()))
            .endPeriod(Date.valueOf(entity.getEndPeriod())).invoiceNumber(entity.getId())
            .client(transformToClient(entity.getClient())).build();
    }

    public Subscription transformToSubscription(SubscriptionEntity subscriptionEntity) {
        return Subscription.builder().name(subscriptionEntity.getName()).data(subscriptionEntity.getData()).price(
            subscriptionEntity.getPrice()).build();
    }

    public ConsumptionEntity transformToConsumptionEntity(com.atts.tools.msystem.domain.model.Consumption consumption) {
        ConsumptionEntity consumptionEntity = new ConsumptionEntity();
        consumptionEntity.setCount(consumption.getConsumptionCount());
        consumptionEntity.setId(consumption.getId());
        consumptionEntity.setDuration(consumption.getConsumptionDuration());
        consumptionEntity.setType(consumption.getType().name());
        return consumptionEntity;
    }

    public Client transformToClient(ClientEntity clientEntity) {
        return Client.builder().clientReference(new ClientReference(clientEntity.getReference()))
            .defaultSubscription(clientEntity.getDefaultSubscription())
            .activeDiverse(clientEntity.getDiverse() == 1).email(clientEntity.getEmail())
            .address(clientEntity.getAddress())
            .diverseSubscription(clientEntity.getDiverseAmount())
            .postalCode(clientEntity.getPostalCode()).build();
    }

    public ClientEntity transformToClientEntity(Client client) {
        ClientEntity entity = new ClientEntity();
        entity.setId(client.getId());
        entity.setDefaultSubscription(client.getDefaultSubscription());
        entity.setDiverseAmount(client.getDiverseSubscription());
        entity.setPostalCode(client.getPostalCode());
        entity.setDiverse(Integer.valueOf(client.getActiveDiverse() ? 1 : 0).byteValue());
        entity.setEmail(client.getEmail());
        entity.setName(client.getName());
        entity.setReference(client.getClientReference().reference());
        entity.setAddress(client.getAddress());
        return entity;
    }


    public InvoiceEntity transformToInvoiceEntity(com.atts.tools.msystem.domain.model.Invoice invoice) {
        InvoiceEntity invoiceEntity = new InvoiceEntity();
        invoiceEntity.setClient(
            clientRepository.findClientByReference(invoice.getClient().getClientReference().reference()).get());
        invoiceEntity.setStartPeriod(invoice.getStartPeriod().toLocalDate());
        invoiceEntity.setEndPeriod(invoice.getEndPeriod().toLocalDate());
        invoiceEntity.getConsumptions().addAll(
            invoice.getConsumptions().stream().map(this::transformToConsumptionEntity).collect(
                Collectors.toSet()));
        invoiceEntity.setHtAmount(invoiceEntity.getHtAmount());
        invoiceEntity.setTtcAmount(invoice.getTtcAmount());
        invoiceEntity.setProforma((byte) (invoice.getProforma() ? 1 : 0));
        invoiceEntity.setFileUri(invoice.getFileUri());
        invoiceEntity.setId(invoice.getInvoiceNumber());
        return invoiceEntity;
    }
}
