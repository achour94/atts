package com.atts.tools.msystem.domain.ports.out;

import com.atts.tools.msystem.domain.model.Client;
import com.atts.tools.msystem.domain.model.pageable.RequestPage;
import com.atts.tools.msystem.domain.model.pageable.SearchCriteria;
import org.springframework.data.domain.Page;

public interface ClientCriteriaPort {
    Page<Client> findAllWithFilters(RequestPage page, SearchCriteria criteria);
}
