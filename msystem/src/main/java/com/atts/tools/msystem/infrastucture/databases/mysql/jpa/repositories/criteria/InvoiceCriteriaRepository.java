package com.atts.tools.msystem.infrastucture.databases.mysql.jpa.repositories.criteria;

import com.atts.tools.msystem.domain.model.Invoice;
import com.atts.tools.msystem.domain.model.pageable.RequestPage;
import com.atts.tools.msystem.domain.model.pageable.SearchCriteria;
import com.atts.tools.msystem.domain.ports.out.datastore.InvoiceCriteriaPort;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.entities.InvoiceEntity;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.utils.Transformer;
import jakarta.persistence.EntityManager;
import java.util.Collection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Repository;

//sort by a single columns, contains, equals, startsWith, endWidth, isEmpty, is any of [....], range
//
@Repository
public class InvoiceCriteriaRepository implements InvoiceCriteriaPort {
    private final CriteriaRepository<InvoiceEntity, Invoice> criteriaRepository;

    @Autowired
    public InvoiceCriteriaRepository(EntityManager entityManager, Transformer transformer) {
        this.criteriaRepository = new CriteriaRepository<>(entityManager, InvoiceEntity.class,
            transformer::transformToInvoice);
    }

    @Override
    public Page<Invoice> findAllWithFilters(RequestPage page,
        Collection<SearchCriteria> criterias) {
        return criteriaRepository.findAllWithFilters(page, criterias);
    }
}
