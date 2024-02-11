package com.atts.tools.msystem.infrastucture.databases.mysql;

import com.atts.tools.msystem.domain.model.Client;
import com.atts.tools.msystem.domain.model.Invoice;
import com.atts.tools.msystem.domain.ports.out.datastore.InvoiceStoragePort;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.entities.ConsumptionEntity;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.entities.InvoiceEntity;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.repositories.ConsumptionRepository;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.repositories.InvoiceRepository;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.utils.Transformer;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class InvoiceStorageAdapter implements InvoiceStoragePort {

    private final InvoiceRepository invoiceRepository;
    private final Transformer transformer;
    private final ConsumptionRepository consumptionRepository;

    @Override
    public void save(Collection<Invoice> invoices) {
        invoices.stream().map(transformer::transformToInvoiceEntity).forEach(invoiceEntity -> {
                InvoiceEntity entity = invoiceRepository.save(invoiceEntity);
                consumptionRepository.saveAll(invoiceEntity.getConsumptions().stream()
                    .peek(consumptionEntity -> consumptionEntity.setInvoiceEntity(entity)).collect(
                        Collectors.toList()));
            }
        );
    }

    @Override
    public void save(Invoice invoice) {
        InvoiceEntity invoiceEntity = invoiceRepository.save(transformer.transformToInvoiceEntity(invoice));

        Collection<ConsumptionEntity> consumptions = invoice.getConsumptions().stream()
            .map(transformer::transformToConsumptionEntity)
            .peek(consumptionEntity -> consumptionEntity.setInvoiceEntity(invoiceEntity)).collect(
                Collectors.toList());
        consumptionRepository.saveAll(consumptions);
    }


    @Override
    public Optional<Invoice> findById(Integer id) {
        return invoiceRepository.findById(id).map(transformer::transformToInvoice);
    }

    @Override
    public List<Invoice> findAllByIds(Collection<Integer> ids) {
        return invoiceRepository.findAllById(ids).stream().map(transformer::transformToInvoice)
            .collect(Collectors.toList());
    }

    @Override
    public List<Invoice> findByClients(List<Client> clients) {
        return clients.stream()
            .flatMap(
                client -> invoiceRepository.findAllByClientReference(client.getClientReference().reference()).stream()
                    .map(transformer::transformToInvoice)).collect(
                Collectors.toList());
    }

    @Override
    public void delete(Collection<Invoice> invoices) {
        invoiceRepository.deleteAllById(invoices.stream().map(Invoice::getId).collect(Collectors.toList()));
    }

    @Override
    public void delete(List<Integer> invoiceIds) {
        invoiceRepository.deleteAllById(invoiceIds);
    }
}
