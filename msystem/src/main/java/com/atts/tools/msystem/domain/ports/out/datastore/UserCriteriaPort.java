package com.atts.tools.msystem.domain.ports.out.datastore;

import com.atts.tools.msystem.domain.model.User;
import com.atts.tools.msystem.domain.model.pageable.RequestPage;
import com.atts.tools.msystem.domain.model.pageable.SearchCriteria;
import java.util.Collection;
import org.springframework.data.domain.Page;

public interface UserCriteriaPort {

    Page<User> findAllWithFilters(RequestPage page, Collection<SearchCriteria> criteria);
}
