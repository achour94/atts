package com.atts.tools.msystem.domain.services.processors;

import com.atts.tools.msystem.domain.model.types.ClientReference;
import java.util.List;
import java.util.Map;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class ClientsResults {
    Map<ClientReference, ClientSummary> clientsSummary;
    List<ProcessError> errors;
}
