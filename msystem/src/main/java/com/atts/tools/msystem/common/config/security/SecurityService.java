package com.atts.tools.msystem.common.config.security;

import com.atts.tools.msystem.domain.model.Invoice;
import com.atts.tools.msystem.domain.model.Role;
import com.atts.tools.msystem.domain.model.User;
import com.atts.tools.msystem.domain.ports.out.datastore.InvoiceStoragePort;
import com.atts.tools.msystem.domain.ports.out.datastore.UserStoragePort;
import java.util.Collection;
import java.util.NoSuchElementException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

@Component("securityService")
@RequiredArgsConstructor
public class SecurityService {

    private final InvoiceStoragePort invoiceStoragePort;
    private final UserStoragePort userStoragePort;


    public boolean hasPermission(ElementSecurityType elementSecurityType, Object element) {
        Collection<? extends GrantedAuthority> authorities = SecurityContextHolder.getContext().getAuthentication()
            .getAuthorities();
        if (authorities.stream()
            .anyMatch(grantedAuthority -> Role.ADMIN.toAuthority().equals(grantedAuthority.getAuthority()))) {
            return true;
        }
        if (authorities.stream()
            .noneMatch(grantedAuthority -> Role.CLIENT.toAuthority().equals(grantedAuthority.getAuthority()))) {
            return false;
        }
        String username = (String) ((Jwt) SecurityContextHolder.getContext().getAuthentication()
            .getCredentials()).getClaims()
            .get("preferred_username");
        if (elementSecurityType.equals(ElementSecurityType.INVOICE)) {
            Integer invoiceNumber = (Integer) element;
            Invoice invoice = invoiceStoragePort.findById(invoiceNumber)
                .orElseThrow(NoSuchElementException::new);
            User user = userStoragePort.findUserByUsername(username);
            return invoice.getClient().getClientReference().equals(user.getClient().getClientReference());
        }
        return false;
    }
}
