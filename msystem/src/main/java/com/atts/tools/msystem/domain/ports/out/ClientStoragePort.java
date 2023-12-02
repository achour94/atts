package com.atts.tools.msystem.domain.ports.out;

import com.atts.tools.msystem.domain.model.Client;
import com.atts.tools.msystem.domain.model.types.ClientReference;
import java.util.Collection;
import java.util.Optional;

public interface ClientStoragePort {
    Optional<Client> findBy(ClientReference clientReference);
    void save(Collection<Client> clients);
}
