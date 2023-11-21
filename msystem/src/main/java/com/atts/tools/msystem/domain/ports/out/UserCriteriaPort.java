package com.atts.tools.msystem.domain.ports.out;

import com.atts.tools.msystem.domain.model.User;
import com.atts.tools.msystem.domain.model.pageable.user.UserPage;
import com.atts.tools.msystem.domain.model.pageable.user.UserSearchCriteria;
import org.springframework.data.domain.Page;

public interface UserCriteriaPort {

    Page<User> findAllWithFilters(UserPage page, UserSearchCriteria criteria);
}
