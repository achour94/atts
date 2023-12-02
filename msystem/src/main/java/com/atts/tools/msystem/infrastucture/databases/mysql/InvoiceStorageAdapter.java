package com.atts.tools.msystem.infrastucture.databases.mysql;

import com.atts.tools.msystem.domain.model.Invoice;
import com.atts.tools.msystem.domain.ports.out.InvoiceStoragePort;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.entities.InvoiceEntity;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.repositories.ConsumptionRepository;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.repositories.InvoiceRepository;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.utils.Transformer;
import java.util.Collection;
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
                InvoiceEntity savedInvoice = invoiceRepository.save(invoiceEntity);
                consumptionRepository.saveAll(invoiceEntity.getConsumptions().stream()
                    .peek(consumptionEntity -> consumptionEntity.setInvoiceEntity(savedInvoice))
                    .collect(Collectors.toList()));
            }
        );
    }
}
