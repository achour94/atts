package com.atts.tools.msystem.domain.services;

import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GenerationConfig {
    private LocalDate creationDate;
    private Boolean reset;
    private Boolean proforma;
}
