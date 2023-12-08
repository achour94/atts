package com.atts.tools.msystem.domain.ports.out.datastore;

import com.atts.tools.msystem.domain.model.Invoice;
import com.atts.tools.msystem.domain.model.pageable.RequestPage;
import com.atts.tools.msystem.domain.model.pageable.SearchCriteria;
import org.springframework.data.domain.Page;

public interface InvoiceCriteriaPort {
    Page<Invoice> findAllWithFilters(RequestPage page, SearchCriteria criteria);
}
