package com.atts.tools.msystem.domain.logging;

import com.atts.tools.msystem.domain.model.ModelEntity;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.Instant;
import java.time.LocalDate;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class Log implements ModelEntity {
    @JsonProperty("logId")
    Integer id;
    Instant createdAt;
    LogSource source;
    SecurityLevel level;
    String message;
}
