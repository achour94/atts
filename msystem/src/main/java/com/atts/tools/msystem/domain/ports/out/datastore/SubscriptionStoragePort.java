package com.atts.tools.msystem.domain.ports.out.datastore;

import com.atts.tools.msystem.domain.model.Subscription;
import com.atts.tools.msystem.domain.model.types.ClientReference;
import java.util.Collection;
import java.util.List;

public interface SubscriptionStoragePort {
    List<Subscription> findBy(ClientReference clientReference);
    void delete(Collection<Subscription> subscriptions);
}
