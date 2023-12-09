package com.atts.tools.msystem.domain.model;

public enum Role {
    ADMIN("admin"), CLIENT("client");
    private String label;

    Role(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

    public String toAuthority() {
        return "ROLE_" + label;
    }
}
