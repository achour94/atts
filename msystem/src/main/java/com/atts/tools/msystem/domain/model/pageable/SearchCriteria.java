package com.atts.tools.msystem.domain.model.pageable;

import java.util.List;
import lombok.Value;

@Value
public class SearchCriteria {
    String column;
    String equalsWith;
    String contains;
    String startsWith;
    String endsWith;
    String min;
    String max;
    Boolean isEmpty;
    List<String> anyOf;
}
