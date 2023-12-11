package com.atts.tools.msystem.domain.ports.out.datastore;

import com.atts.tools.msystem.domain.model.Invoice;
import com.atts.tools.msystem.domain.model.pageable.RequestPage;
import com.atts.tools.msystem.domain.model.pageable.SearchCriteria;
import java.util.Collection;
import java.util.List;
import org.springframework.data.domain.Page;

public interface InvoiceCriteriaPort {
    Page<Invoice> findAllWithFilters(RequestPage page, Collection<SearchCriteria> criteria);
    Page<Invoice> findAllWithFiltersAndRestrictions(RequestPage page, Collection<SearchCriteria> criteria);
}
