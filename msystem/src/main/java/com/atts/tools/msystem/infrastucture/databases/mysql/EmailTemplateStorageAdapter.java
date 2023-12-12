package com.atts.tools.msystem.infrastucture.databases.mysql;

import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.repositories.EmailTemplateRepository;
import com.atts.tools.msystem.domain.model.EmailTemplate;
import com.atts.tools.msystem.domain.ports.out.datastore.EmailTemplateStoragePort;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.utils.Transformer;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EmailTemplateStorageAdapter implements EmailTemplateStoragePort {

    private final EmailTemplateRepository emailTemplateRepository;
    private final Transformer transformer;

    @Override
    public EmailTemplate save(EmailTemplate emailTemplate) {
        return transformer.transformToEmailTemplateWithoutUser(
            emailTemplateRepository.save(transformer.transformToEmailTemplateEntity(emailTemplate)));
    }

    @Override
    public Optional<EmailTemplate> findById(Integer id) {
        return emailTemplateRepository.findById(id).map(transformer::transformToEmailTemplate);
    }

    @Override
    public void deleteById(Integer id) {
        emailTemplateRepository.deleteById(id);
    }
}
