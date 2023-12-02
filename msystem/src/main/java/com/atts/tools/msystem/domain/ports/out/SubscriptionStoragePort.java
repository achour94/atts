package com.atts.tools.msystem.domain.ports.out;

import com.atts.tools.msystem.domain.model.Subscription;
import com.atts.tools.msystem.domain.model.types.ClientReference;
import java.util.List;

public interface SubscriptionStoragePort {
    List<Subscription> findBy(ClientReference clientReference);
}
