package com.atts.tools.msystem.domain.ports.out.file;

import com.atts.tools.msystem.domain.model.Invoice;

public interface FileGeneratorPort {

    byte[] generateFile(Invoice invoice);

    String getFileType();
}
