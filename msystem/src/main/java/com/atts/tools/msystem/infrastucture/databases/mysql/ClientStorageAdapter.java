package com.atts.tools.msystem.infrastucture.databases.mysql;

import com.atts.tools.msystem.domain.model.Client;
import com.atts.tools.msystem.domain.model.types.ClientReference;
import com.atts.tools.msystem.domain.ports.out.datastore.ClientStoragePort;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.repositories.ClientRepository;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.utils.Transformer;
import java.util.Collection;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ClientStorageAdapter implements ClientStoragePort {

    private final ClientRepository clientRepository;
    private final Transformer transformer;


    @Override
    public Optional<Client> findBy(ClientReference clientReference) {http://localhost:3000"
        return clientRepository.findClientByReference(clientReference.reference()).map(transformer::transformToClient);
    }

    @Override
    public void save(Collection<Client> clients) {
        clientRepository.saveAll(clients.stream().map(transformer::transformToClientEntity).collect(Collectors.toList()));
    }
}
