package com.atts.tools.msystem.domain.services;

import com.atts.tools.msystem.common.annotations.UseCase;
import com.atts.tools.msystem.common.exceptions.types.IlegalRequestException;
import com.atts.tools.msystem.common.exceptions.types.IlegalRequestRuntimeException;
import com.atts.tools.msystem.common.exceptions.types.NotFoundElementException;
import com.atts.tools.msystem.domain.logging.InfoLog;
import com.atts.tools.msystem.domain.logging.LogSource;
import com.atts.tools.msystem.domain.model.Client;
import com.atts.tools.msystem.domain.model.Invoice;
import com.atts.tools.msystem.domain.model.Subscription;
import com.atts.tools.msystem.domain.ports.in.usecases.ManageClientUseCase;
import com.atts.tools.msystem.domain.ports.out.datastore.ClientStoragePort;
import com.atts.tools.msystem.domain.ports.out.datastore.InvoiceStoragePort;
import com.atts.tools.msystem.domain.ports.out.datastore.SubscriptionStoragePort;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;

@UseCase
@RequiredArgsConstructor
@Transactional
public class ClientService implements ManageClientUseCase {

    private final SubscriptionStoragePort subscriptionStoragePort;
    private final ClientStoragePort clientStoragePort;
    private final InvoiceStoragePort invoiceStoragePort;
    private final InvoiceService invoiceService;

    @Override
    public Client create(Client client) throws IlegalRequestException {
        if (client.getId() != null) {
            throw new IlegalRequestException("You cannot set an id for a new client!");
        }
        if (client.getSubscriptions().stream().anyMatch(subscription -> subscription.getId() != null)) {
            throw new IlegalRequestException("You cannot add an existing subscription to a new client!");
        }
        return clientStoragePort.save(client);
    }

    @Override
    public Client update(Client updatedClient) throws IlegalRequestException {
        Client currentClient = clientStoragePort.findById(updatedClient.getId())
            .orElseThrow(NoSuchElementException::new);
        List<Subscription> currentSubscriptionList = currentClient.getSubscriptions();
        if (updatedClient.getSubscriptions() != null) {
            try {
                updatedClient.getSubscriptions().stream().filter(
                        subscription -> subscription.getId() != null && (currentSubscriptionList == null
                            || currentSubscriptionList.stream()
                            .noneMatch(sub -> sub.getId().equals(subscription.getId()))))
                    .findAny().ifPresent(x -> {
                        throw new IlegalRequestRuntimeException("You cannot connect a Subscription to another Client");
                    });
            } catch (IlegalRequestRuntimeException exception) {
                throw new IlegalRequestException(exception.getMessage());
            }
        }
        //delete no used subscription after update
        if (currentSubscriptionList != null) {
            subscriptionStoragePort.delete(currentSubscriptionList.stream().filter(
                sub -> updatedClient.getSubscriptions().stream()
                    .noneMatch(subscription -> sub.getId().equals(subscription.getId()))).toList());
        }

        for(Invoice invoice : invoiceStoragePort.findByClients(List.of(updatedClient))) {
            //we do this to recompute totalHTAmount for new diverse
            invoiceService.updateInvoiceBasedOnConsumptionsAndClient(invoice, updatedClient);
            invoiceStoragePort.save(invoice);
        }
        return clientStoragePort.save(updatedClient);
    }

    @Override
    @InfoLog(source = LogSource.CLIENT, messageTemplate = "Clients with the following ids: %s were deleted", argsFunction = {
        0})
    public void delete(List<Integer> ids) throws NotFoundElementException {
        List<Client> clients = clientStoragePort.findByIds(ids);
        if (clients.size() != ids.size()) {
            throw new NotFoundElementException();
        }
        subscriptionStoragePort.delete(clients.stream().flatMap(client -> client.getSubscriptions().stream()).collect(
            Collectors.toList()));
        invoiceStoragePort.delete(invoiceStoragePort.findByClients(clients));
        clientStoragePort.delete(clients);
    }
}
