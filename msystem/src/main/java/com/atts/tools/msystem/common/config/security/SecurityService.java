package com.atts.tools.msystem.common.config.security;

import com.atts.tools.msystem.domain.model.Invoice;
import com.atts.tools.msystem.domain.model.InvoiceStatus;
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

        if (authorizationUtil.currentUserIsAdmin()) {
            return true;
        }
        //We do this to avoid unauthorize users from keycloak to access the api
        if (!authorizationUtil.currentUserIsClient()) {
            return false;
        }

        String username = authorizationUtil.getCurrentUserUsername();
        if (elementSecurityType.equals(ElementSecurityType.INVOICE)) {
            Integer invoiceNumber = (Integer) element;
            Invoice invoice = invoiceStoragePort.findById(invoiceNumber)
                .orElseThrow(NoSuchElementException::new);
            User user = userStoragePort.findUserByUsername(username);
            return invoice.getClient().getClientReference().equals(user.getClient().getClientReference())
                && InvoiceStatus.SHARED.equals(invoice.getStatus());
        }
        return false;
    }
}
