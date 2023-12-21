package com.atts.tools.msystem.infrastucture.databases.mysql;

import com.atts.tools.msystem.domain.model.Client;
import com.atts.tools.msystem.domain.model.types.ClientReference;
import com.atts.tools.msystem.domain.ports.out.datastore.ClientStoragePort;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.entities.ClientEntity;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.entities.SubscriptionEntity;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.repositories.ClientRepository;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.repositories.SubscriptionRepository;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.utils.Transformer;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ClientStorageAdapter implements ClientStoragePort {

    private final ClientRepository clientRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final Transformer transformer;


    @Override
    public Optional<Client> findBy(ClientReference clientReference) {
        return clientRepository.findClientByReference(clientReference.reference()).map(transformer::transformToClient);
    }

    @Override
    public Optional<Client> findById(Integer id) {
        return clientRepository.findById(id).map(transformer::transformToClient);
    }

    @Override
    public List<Client> findByIds(List<Integer> ids) {
        return clientRepository.findAllById(ids).stream().map(transformer::transformToClient)
            .collect(Collectors.toList());
    }

    @Override
    public void save(Collection<Client> clients) {
        clientRepository.saveAll(
            clients.stream().map(transformer::transformToClientEntity).collect(Collectors.toList()));
    }

    @Override
    public Client save(Client client) {
        ClientEntity clientEntity = transformer.transformToClientEntity(client);
        ClientEntity result = clientRepository.save(clientEntity);
        List<SubscriptionEntity> subscriptions = clientEntity.getSubscriptions().stream()
            .peek(subscriptionEntity -> subscriptionEntity.setClient(result)).toList();
        result.setSubscriptions(new HashSet<>(subscriptionRepository.saveAll(subscriptions)));
        return transformer.transformToClient(result);
    }

    @Override
    public void delete(Client client) {
        clientRepository.delete(transformer.transformToClientEntity(client));
    }

    @Override
    public void delete(Collection<Client> clients) {
        clientRepository.deleteAll(
            clients.stream().map(transformer::transformToClientEntity).collect(Collectors.toList()));
    }
}
