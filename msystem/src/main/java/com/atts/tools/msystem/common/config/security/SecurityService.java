package com.atts.tools.msystem.common.config.security;

import com.atts.tools.msystem.domain.model.EmailTemplate;
import com.atts.tools.msystem.domain.model.Invoice;
import com.atts.tools.msystem.domain.model.enums.InvoiceStatus;
import com.atts.tools.msystem.domain.model.User;
import com.atts.tools.msystem.domain.ports.out.datastore.InvoiceStoragePort;
import com.atts.tools.msystem.domain.ports.out.datastore.UserStoragePort;
import java.util.NoSuchElementException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component("securityService")
@RequiredArgsConstructor
public class SecurityService {

    private final InvoiceStoragePort invoiceStoragePort;
    private final UserStoragePort userStoragePort;
    private final AuthorizationUtil authorizationUtil;


    public boolean hasPermission(ElementSecurityType elementSecurityType, Object element) {
        if (ElementSecurityType.INVOICE.equals(elementSecurityType)) {
            return hasPermissionToInvoice((Integer) element);
        } else if (ElementSecurityType.EMAIL_TEMPLATE.equals(elementSecurityType)) {
            return hasPermissionToEmailTemplate(element);
        } else if (ElementSecurityType.USER.equals(elementSecurityType)) {
            return hasPermissionUser(element);
        }
        return false;
    }

    private boolean hasPermissionToInvoice(Integer element) {
        if (authorizationUtil.currentUserIsAdmin()) {
            return true;
        }
        //We do this to avoid unauthorize users from keycloak to access the api
        if (!authorizationUtil.currentUserIsClient()) {
            return false;
        }

        String username = authorizationUtil.getCurrentUserUsername();
        Invoice invoice = invoiceStoragePort.findById(element)
            .orElseThrow(NoSuchElementException::new);
        User user = userStoragePort.findUserByUsername(username);
        return invoice.getClient().getClientReference().equals(user.getClient().getClientReference())
            && InvoiceStatus.SHARED.equals(invoice.getStatus());
    }

    private boolean hasPermissionToEmailTemplate(Object element) {
        User user = userStoragePort.findUserByUsername(authorizationUtil.getCurrentUserUsername());
        if (user != null) {
            if (element instanceof Integer) {
                return user.getEmailTemplates().stream()
                    .anyMatch(emailTemplate -> element.equals(emailTemplate.getId()));
            } else if (element instanceof EmailTemplate) {
                return user.getEmailTemplates().stream()
                    .anyMatch(emailTemplate -> ((EmailTemplate) element).getId().equals(emailTemplate.getId()));
            }
        }
        return false;
    }

    private boolean hasPermissionUser(Object element) {
        return authorizationUtil.currentUserIsAdmin() || authorizationUtil.getCurrentUserUsername().equals(element);
    }
}
