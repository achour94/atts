package com.atts.tools.msystem.infrastucture.databases.mysql.jpa.repositories.criteria;

import com.atts.tools.msystem.domain.model.pageable.SearchCriteria;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CriteriaMapper {

    private final ObjectMapper jsonMapper;

    public List<SearchCriteria> convert(String criteria) {
        if (criteria == null) {
            return null;
        }
        try {
            return List.of(jsonMapper.readValue(criteria, SearchCriteria[].class));
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
