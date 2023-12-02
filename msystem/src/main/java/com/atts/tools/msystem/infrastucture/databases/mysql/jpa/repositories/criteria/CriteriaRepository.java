package com.atts.tools.msystem.infrastucture.databases.mysql.jpa.repositories.criteria;

import com.atts.tools.msystem.domain.model.ModelEntity;
import com.atts.tools.msystem.domain.model.pageable.RequestPage;
import com.atts.tools.msystem.domain.model.pageable.SearchCriteria;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.entities.DBEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;

public class CriteriaRepository<T extends DBEntity, M extends ModelEntity> {

    private final EntityManager entityManager;
    private final CriteriaBuilder criteriaBuilder;
    private final Class<T> type;
    private final Function<T, M> transformer;

    public CriteriaRepository(EntityManager entityManager, Class<T> type, Function<T, M> transformer) {
        this.entityManager = entityManager;
        this.criteriaBuilder = entityManager.getCriteriaBuilder();
        this.type = type;
        this.transformer = transformer;
    }

    public Page<M> findAllWithFilters(RequestPage page, SearchCriteria criteria) throws NoSuchFieldException {
        CriteriaQuery<T> criteriaQuery = criteriaBuilder.createQuery(type);
        Root<T> root = criteriaQuery.from(type);
        Class columnType = extractFieldType(criteria.getColumn());
        Predicate predicate = getPredicate(criteria, root, columnType);
        criteriaQuery.where(predicate);
        setOrder(page, criteriaQuery, root);
        TypedQuery<T> typedQuery = entityManager.createQuery(criteriaQuery);
        typedQuery.setFirstResult(page.getPageNumber() * page.getPageSize());
        typedQuery.setMaxResults(page.getPageSize());

        Pageable pageable = getPageable(page);
        long count = getCount(criteria, columnType);

        return new PageImpl<>(typedQuery.getResultList().stream().map(transformer).collect(Collectors.toList()),
            pageable, count);
    }

    private Class extractFieldType(String columnName) throws NoSuchFieldException {
        return type.getDeclaredField(columnName).getType();
    }

    private long getCount(SearchCriteria criteria, Class columnType) {
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<T> countRoot = countQuery.from(type);
        countQuery.select(criteriaBuilder.count(countRoot)).where(getPredicate(criteria, countRoot, columnType));
        return entityManager.createQuery(countQuery).getSingleResult();
    }

    private Pageable getPageable(RequestPage page) {
        Sort sort = Sort.by(page.getSortDirection(), page.getSortBy());
        return PageRequest.of(page.getPageNumber(), page.getPageSize(), sort);
    }

    private void setOrder(RequestPage page, CriteriaQuery<T> criteriaQuery, Root<T> root) {
        if (page.getSortDirection().equals(Direction.ASC)) {
            criteriaQuery.orderBy(criteriaBuilder.asc(root.get(page.getSortBy())));
        } else {
            criteriaQuery.orderBy(criteriaBuilder.desc(root.get(page.getSortBy())));
        }
    }

    private Predicate getPredicate(SearchCriteria criteria, Root<T> root, Class columnType) {
        List<Predicate> predicates = new ArrayList<>();

        if (Objects.nonNull(criteria.getContains())) {
            predicates.add(
                criteriaBuilder.equal(root.get(criteria.getColumn()), criteria.getContains())

            );
        }
        if (Objects.nonNull(criteria.getStartsWith())) {
            predicates.add(
                criteriaBuilder.like(root.get(criteria.getColumn()), criteria.getStartsWith() + "%")

            );
        }

        if (Objects.nonNull(criteria.getEndsWith())) {
            predicates.add(
                criteriaBuilder.like(root.get(criteria.getColumn()), "%" + criteria.getEndsWith())

            );
        }

        if (Objects.nonNull(criteria.getContains())) {
            predicates.add(
                criteriaBuilder.like(root.get(criteria.getColumn()), "%" + criteria.getContains() + "%")

            );
        }

        if (Objects.nonNull(criteria.getMin())) {
            predicates.add(
                criteriaBuilder.greaterThanOrEqualTo(root.get(criteria.getColumn()), StringToTypeConverter.toComparableType(criteria.getMin(), columnType))

            );
        }

        if (Objects.nonNull(criteria.getMax())) {
            predicates.add(
                criteriaBuilder.lessThanOrEqualTo(root.get(criteria.getColumn()), StringToTypeConverter.toComparableType(criteria.getMax(), columnType))
            );
        }

        if (Objects.nonNull(criteria.getAnyOf()) && !criteria.getAnyOf().isEmpty()) {
            predicates.add(
                root.get(criteria.getColumn()).in(criteria.getAnyOf())
            );
        }

        if (Objects.nonNull(criteria.getIsEmpty())) {
            if (criteria.getIsEmpty()) {
                predicates.add(
                    criteriaBuilder.isEmpty(root.get(criteria.getColumn()))
                );
            } else {
                predicates.add(
                    criteriaBuilder.isNotEmpty(root.get(criteria.getColumn()))
                );
            }
        }

        return criteriaBuilder.and(predicates.toArray(Predicate[]::new));
    }
}
