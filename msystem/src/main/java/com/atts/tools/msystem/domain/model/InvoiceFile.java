package com.atts.tools.msystem.domain.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class InvoiceFile {
    byte[] content;
    String filename;

    @Override
    public String toString() {
        return filename;
    }
}
