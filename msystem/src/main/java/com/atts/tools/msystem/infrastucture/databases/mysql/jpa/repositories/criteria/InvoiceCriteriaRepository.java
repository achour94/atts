package com.atts.tools.msystem.infrastucture.databases.mysql.jpa.repositories.criteria;

import com.atts.tools.msystem.common.config.security.AuthorizationUtil;
import com.atts.tools.msystem.domain.model.Invoice;
import com.atts.tools.msystem.domain.model.InvoiceStatus;
import com.atts.tools.msystem.domain.model.pageable.RequestPage;
import com.atts.tools.msystem.domain.model.pageable.SearchCriteria;
import com.atts.tools.msystem.domain.ports.out.datastore.InvoiceCriteriaPort;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.entities.InvoiceEntity;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.entities.UserEntity;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.repositories.UserRepository;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.utils.Transformer;
import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.ws.rs.ForbiddenException;
import java.util.Collection;
import java.util.function.BiFunction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Repository;

//sort by a single columns, contains, equals, startsWith, endWidth, isEmpty, is any of [....], range
//
@Repository
public class InvoiceCriteriaRepository implements InvoiceCriteriaPort {

    private final CriteriaRepository<InvoiceEntity, Invoice> criteriaRepository;
    private final UserRepository userRepository;
    private final AuthorizationUtil authorizationUtil;

    @Autowired
    public InvoiceCriteriaRepository(EntityManager entityManager, Transformer transformer,
        UserRepository userRepository, AuthorizationUtil authorizationUtil) {
        this.criteriaRepository = new CriteriaRepository<>(entityManager, InvoiceEntity.class,
            transformer::transformToInvoice);
        this.userRepository = userRepository;
        this.authorizationUtil = authorizationUtil;
    }

    @Override
    public Page<Invoice> findAllWithFilters(RequestPage page,
        Collection<SearchCriteria> criteria) {
        return criteriaRepository.findAllWithFilters(page, criteria, null);
    }

    @Override
    public Page<Invoice> findAllWithFiltersAndRestrictions(RequestPage page, Collection<SearchCriteria> criteria) {
        BiFunction<Root<InvoiceEntity>, CriteriaBuilder, Predicate> securityPredicateGen = null;
        if (!authorizationUtil.currentUserIsAdmin()) {
            UserEntity userEntity = userRepository.findUserEntityByUsername(authorizationUtil.getCurrentUserUsername())
                .stream().findAny().orElseThrow(() -> new ForbiddenException(
                    "You cannot access this endpoint with a non admin that is not known by application!"));
            securityPredicateGen = (invoiceEntityRoot, criteriaBuilder) -> criteriaBuilder.and(criteriaBuilder.equal(
                    invoiceEntityRoot.get("client").get("reference"), userEntity.getClient().getReference()),
                criteriaBuilder.equal(invoiceEntityRoot.get("status"),
                    InvoiceStatus.SHARED.name()));
        }
        return criteriaRepository.findAllWithFilters(page, criteria, securityPredicateGen);
    }
}
