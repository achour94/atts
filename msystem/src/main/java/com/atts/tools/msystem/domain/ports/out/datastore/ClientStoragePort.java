package com.atts.tools.msystem.domain.ports.out.datastore;

import com.atts.tools.msystem.domain.model.Client;
import com.atts.tools.msystem.domain.model.types.ClientReference;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ClientStoragePort {
    Optional<Client> findBy(ClientReference clientReference);
    Optional<Client> findById(Integer id);
    List<Client> findByIds(List<Integer> ids);
    void save(Collection<Client> clients);
    Client save(Client client);
    void delete(Client client);
    void delete(Collection<Client> clients);
}
