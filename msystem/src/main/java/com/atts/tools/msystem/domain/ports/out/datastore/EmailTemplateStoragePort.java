package com.atts.tools.msystem.domain.ports.out.datastore;

import com.atts.tools.msystem.domain.model.EmailTemplate;
import java.util.Optional;

public interface EmailTemplateStoragePort {
    EmailTemplate save(EmailTemplate emailTemplate);
    Optional<EmailTemplate> findById(Integer id);
    void deleteById(Integer id);
}
