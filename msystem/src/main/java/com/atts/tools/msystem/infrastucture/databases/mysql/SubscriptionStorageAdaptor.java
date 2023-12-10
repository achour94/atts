package com.atts.tools.msystem.infrastucture.databases.mysql;

import com.atts.tools.msystem.domain.model.Subscription;
import com.atts.tools.msystem.domain.model.types.ClientReference;
import com.atts.tools.msystem.domain.ports.out.datastore.SubscriptionStoragePort;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.repositories.SubscriptionRepository;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.utils.Transformer;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SubscriptionStorageAdaptor implements SubscriptionStoragePort {

    private final SubscriptionRepository subscriptionRepository;
    private final Transformer transformer;

    @Override
    public List<Subscription> findBy(ClientReference clientReference) {
        return subscriptionRepository.findAllByClientReference(clientReference.reference()).stream()
            .map(transformer::transformToSubscription).collect(
                Collectors.toList());
    }

    @Override
    public void delete(Collection<Subscription> subscriptions) {
        subscriptionRepository.deleteAll(subscriptions.stream().map(transformer::transformToSubscriptionEntity).collect(
            Collectors.toList()));
    }
}
