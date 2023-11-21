package com.atts.tools.msystem.infrastucture.databases.mysql.jpa.repositories;

import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.entities.User;
import com.atts.tools.msystem.domain.model.pageable.user.UserPage;
import com.atts.tools.msystem.domain.model.pageable.user.UserSearchCriteria;
import com.atts.tools.msystem.domain.ports.out.UserCriteriaPort;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.utils.Transformer;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Repository;

@Repository
public class UserCriteriaRepository implements UserCriteriaPort {

    private final EntityManager entityManager;
    private final CriteriaBuilder criteriaBuilder;

    @Autowired
    public UserCriteriaRepository(EntityManager entityManager) {
        this.entityManager = entityManager;
        this.criteriaBuilder = entityManager.getCriteriaBuilder();
    }

    @Override
    public Page<com.atts.tools.msystem.domain.model.User> findAllWithFilters(UserPage page,
        UserSearchCriteria criteria) {
        CriteriaQuery<User> criteriaQuery = criteriaBuilder.createQuery(User.class);
        Root<User> userRoot = criteriaQuery.from(User.class);
        Predicate predicate = getPredicate(criteria, userRoot);
        criteriaQuery.where(predicate);
        setOrder(page, criteriaQuery, userRoot);
        TypedQuery<User> typedQuery = entityManager.createQuery(criteriaQuery);
        typedQuery.setFirstResult(page.getPageNumber() * page.getPageSize());
        typedQuery.setMaxResults(page.getPageSize());

        Pageable pageable = getPageable(page);
        long userCount = getEmployeesCount(criteria);

        return new PageImpl<>(typedQuery.getResultList().stream().map(Transformer::transformToUser).collect(
            Collectors.toList()), pageable, userCount);
    }

    private long getEmployeesCount(UserSearchCriteria criteria) {
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<User> countRoot = countQuery.from(User.class);
        countQuery.select(criteriaBuilder.count(countRoot)).where(getPredicate(criteria, countRoot));
        return entityManager.createQuery(countQuery).getSingleResult();
    }

    private Pageable getPageable(UserPage page) {
        Sort sort = Sort.by(page.getSortDirection(), page.getSortBy());
        return PageRequest.of(page.getPageNumber(), page.getPageSize(), sort);
    }

    private void setOrder(UserPage page, CriteriaQuery<User> criteriaQuery, Root<User> userRoot) {
        if (page.getSortDirection().equals(Direction.ASC)) {
            criteriaQuery.orderBy(criteriaBuilder.asc(userRoot.get(page.getSortBy())));
        } else {
            criteriaQuery.orderBy(criteriaBuilder.desc(userRoot.get(page.getSortBy())));
        }
    }

    private Predicate getPredicate(UserSearchCriteria criteria, Root<User> userRoot) {
        List<Predicate> predicates = new ArrayList<>();
        if (Objects.nonNull(criteria.getUsername())) {
            predicates.add(
                criteriaBuilder.like(userRoot.get("username"), "%" + criteria.getUsername() + "%")
            );
        }

        if (Objects.nonNull(criteria.getEmail())) {
            predicates.add(
                criteriaBuilder.like(userRoot.get("email"), "%" + criteria.getEmail() + "%")
            );
        }

        return criteriaBuilder.and(predicates.toArray(Predicate[]::new));
    }
}
