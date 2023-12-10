package com.atts.tools.msystem.infrastucture.databases.mysql.jpa.repositories.criteria;

import com.atts.tools.msystem.domain.model.Client;
import com.atts.tools.msystem.domain.model.pageable.RequestPage;
import com.atts.tools.msystem.domain.model.pageable.SearchCriteria;
import com.atts.tools.msystem.domain.ports.out.datastore.ClientCriteriaPort;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.entities.ClientEntity;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.utils.Transformer;
import jakarta.persistence.EntityManager;
import java.util.Collection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Repository;

@Repository
public class ClientCriteriaRepository implements ClientCriteriaPort {

    private final CriteriaRepository<ClientEntity, Client> criteriaRepository;

    @Autowired
    public ClientCriteriaRepository(EntityManager entityManager, Transformer transformer) {
        this.criteriaRepository = new CriteriaRepository<>(entityManager, ClientEntity.class,
            transformer::transformToClient);
    }

    @Override
    public Page<Client> findAllWithFilters(RequestPage page, Collection<SearchCriteria> criteria) {
        return criteriaRepository.findAllWithFilters(page, criteria, null);
    }
}
