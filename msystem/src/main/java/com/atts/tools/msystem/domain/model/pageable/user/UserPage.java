package com.atts.tools.msystem.domain.model.pageable.user;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.Sort.Direction;

@Getter
@Setter
public class UserPage {
    private int pageNumber = 0;
    private int pageSize = 10;
    private Direction sortDirection = Direction.ASC;
    private String sortBy = "username";
}
