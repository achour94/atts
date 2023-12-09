package com.atts.tools.msystem.infrastucture.databases.mysql.jpa.repositories.criteria;

import com.atts.tools.msystem.domain.model.ModelEntity;
import com.atts.tools.msystem.domain.model.pageable.RequestPage;
import com.atts.tools.msystem.domain.model.pageable.SearchCriteria;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.entities.DBEntity;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.utils.Transformer;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.Collection;
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

    public Page<M> findAllWithFilters(RequestPage page, Collection<SearchCriteria> criterias) {
        CriteriaQuery<T> criteriaQuery = criteriaBuilder.createQuery(type);

        Root<T> root = criteriaQuery.from(type);
        setOrder(page, criteriaQuery, root);
        long count;

        if (criterias != null && !criterias.isEmpty()) {
            Predicate predicate = getPredicate(criterias, root);
            criteriaQuery.where(predicate);
            count = getCount(criterias);
        } else {
            count = getCount(null);
        }

        TypedQuery<T> typedQuery = entityManager.createQuery(criteriaQuery);
        typedQuery.setFirstResult(page.getPageNumber() * page.getPageSize());
        typedQuery.setMaxResults(page.getPageSize());
        Pageable pageable = getPageable(page);

        return new PageImpl<>(
            typedQuery.getResultList().stream().map(transformer).collect(Collectors.toList()),
            pageable, count);
    }

    private Class extractFieldType(String columnName) throws NoSuchFieldException {
        Class columnType = null;
        for (String currentColumn : extractColumnPath(columnName)) {
            if (columnType == null) {
                columnType = type.getDeclaredField(currentColumn).getType();
            } else {
                columnType = columnType.getDeclaredField(currentColumn).getType();
            }
        }

        return columnType;
    }

    private long getCount(Collection<SearchCriteria> criterias) {
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<T> countRoot = countQuery.from(type);
        countQuery.select(criteriaBuilder.count(countRoot));
        if (criterias != null) {
            countQuery.where(getPredicate(criterias, countRoot));
        }

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

    String[] extractColumnPath(String column) {
        return column.split("[.]");
    }

    private Path<? extends Comparable> extractPath(Root<T> root, String column) {
        Path<? extends Comparable> result = null;
        for (String currentColumn : extractColumnPath(column)) {
            if (result == null) {
                result = root.get(currentColumn);
            } else {
                result = result.get(currentColumn);
            }
        }
        return result;
    }

    private Predicate getPredicate(Collection<SearchCriteria> criterias, Root<T> root) {

        List<Predicate> predicates = new ArrayList<>();
        for (SearchCriteria criteria : criterias) {
            String column = Transformer.columnMapper(criteria.column());
            Class columnType;
            Path<? extends Comparable> path = extractPath(root, column);
            try {
                columnType = extractFieldType(column);
            } catch (NoSuchFieldException e) {
                throw new RuntimeException(e);
            }
            if (Objects.nonNull(criteria.equalsWith())) {
                predicates.add(
                    criteriaBuilder.equal(path,
                        StringToTypeConverter.toComparableType(criteria.equalsWith(), columnType))

                );
            }
            if (Objects.nonNull(criteria.startsWith())) {
                predicates.add(
                    criteriaBuilder.like((Expression<String>) path, criteria.startsWith() + "%")

                );
            }

            if (Objects.nonNull(criteria.endsWith())) {
                predicates.add(
                    criteriaBuilder.like((Expression<String>) path, "%" + criteria.endsWith())

                );
            }

            if (Objects.nonNull(criteria.contains())) {
                predicates.add(
                    criteriaBuilder.like((Expression<String>) path, "%" + criteria.contains() + "%")

                );
            }

            if (Objects.nonNull(criteria.min())) {
                predicates.add(
                    criteriaBuilder.greaterThanOrEqualTo(path,
                        StringToTypeConverter.toComparableType(criteria.min(), columnType))

                );
            }

            if (Objects.nonNull(criteria.max())) {
                predicates.add(
                    criteriaBuilder.lessThanOrEqualTo(path,
                        StringToTypeConverter.toComparableType(criteria.max(), columnType))
                );
            }

            if (Objects.nonNull(criteria.anyOf()) && !criteria.anyOf().isEmpty()) {
                predicates.add(
                    path.in(criteria.anyOf())
                );
            }

            if (Objects.nonNull(criteria.isEmpty())) {
                if (criteria.isEmpty()) {
                    predicates.add(
                        criteriaBuilder.isEmpty(root.get(column))
                    );
                } else {
                    predicates.add(
                        criteriaBuilder.isNotEmpty(root.get(column))
                    );
                }
            }
        }

        return criteriaBuilder.and(predicates.toArray(Predicate[]::new));
    }
}
