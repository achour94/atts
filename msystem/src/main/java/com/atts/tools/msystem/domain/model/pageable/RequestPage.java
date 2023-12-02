package com.atts.tools.msystem.domain.model.pageable;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.Sort.Direction;

@Setter
@Getter
public class RequestPage {
    private int pageNumber = 0;
    private int pageSize = 10;
    private Direction sortDirection = Direction.ASC;
    private String sortBy = "id";
}
