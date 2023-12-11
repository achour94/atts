package com.atts.tools.msystem.domain.services;

import com.atts.tools.msystem.common.annotations.UseCase;
import com.atts.tools.msystem.domain.model.Client;
import com.atts.tools.msystem.domain.model.Subscription;
import com.atts.tools.msystem.domain.ports.in.usecases.ManageClientUseCase;
import com.atts.tools.msystem.domain.ports.out.datastore.ClientStoragePort;
import com.atts.tools.msystem.domain.ports.out.datastore.SubscriptionStoragePort;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.NoSuchElementException;
import lombok.RequiredArgsConstructor;

@UseCase
@RequiredArgsConstructor
@Transactional
public class ClientService implements ManageClientUseCase {

    private final SubscriptionStoragePort subscriptionStoragePort;
    private final ClientStoragePort clientStoragePort;

    @Override
    public Client create(Client client) {
        if (client.getId() != null) {
            throw new IllegalStateException("You cannot set an id for a new client!");
        }
        if (client.getSubscriptions().stream().anyMatch(subscription -> subscription.getId() != null)) {
            throw new IllegalStateException("You cannot add an existing subscription to a new client!");
        }
        return clientStoragePort.save(client);
    }

    @Override
    public Client update(Client updatedClient) {
        Client currentClient = clientStoragePort.findById(updatedClient.getId())
            .orElseThrow(NoSuchElementException::new);
        List<Subscription> currentSubscriptionList = currentClient.getSubscriptions();
        if (updatedClient.getSubscriptions() != null) {
            updatedClient.getSubscriptions().stream().filter(
                    subscription -> subscription.getId() != null && (currentSubscriptionList == null || currentSubscriptionList.stream()
                        .noneMatch(sub -> sub.getId().equals(subscription.getId()))))
                .findAny().ifPresent(x -> {
                    throw new IllegalStateException("You cannot connect a Subscription to another Client");
                });
        }
        //delete no used subscription after update
        if (currentSubscriptionList != null) {
            subscriptionStoragePort.delete(currentSubscriptionList.stream().filter(
                sub -> updatedClient.getSubscriptions().stream()
                    .noneMatch(subscription -> sub.getId().equals(subscription.getId()))).toList());
        }
        return clientStoragePort.save(updatedClient);
    }

    @Override
    public void delete(Integer id) {
        Client client = clientStoragePort.findById(id)
            .orElseThrow(NoSuchElementException::new);
        clientStoragePort.delete(client);
    }
}
