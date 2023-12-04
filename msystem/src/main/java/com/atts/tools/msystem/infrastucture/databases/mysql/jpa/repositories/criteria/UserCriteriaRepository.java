package com.atts.tools.msystem.infrastucture.databases.mysql.jpa.repositories.criteria;

import com.atts.tools.msystem.domain.model.User;
import com.atts.tools.msystem.domain.model.pageable.RequestPage;
import com.atts.tools.msystem.domain.model.pageable.SearchCriteria;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.entities.UserEntity;
import com.atts.tools.msystem.domain.ports.out.UserCriteriaPort;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.utils.Transformer;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Repository;

@Repository
public class UserCriteriaRepository implements UserCriteriaPort {

    private final CriteriaRepository<UserEntity, User> criteriaRepository;

    @Autowired
    public UserCriteriaRepository(EntityManager entityManager, Transformer transformer) {
        this.criteriaRepository = new CriteriaRepository<>(entityManager, UserEntity.class,
            transformer::transformToUser);
    }

    @Override
    public Page<User> findAllWithFilters(RequestPage page,
        SearchCriteria criteria) {
        return criteriaRepository.findAllWithFilters(page, criteria);
    }
}
