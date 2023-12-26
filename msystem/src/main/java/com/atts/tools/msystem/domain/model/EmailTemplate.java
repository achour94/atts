package com.atts.tools.msystem.domain.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmailTemplate {
    public static String DEFAULT_TEMPLATE_INVOICE = "<p>Cher Client,</p><p>&nbsp;Nous vous prions "
        + "de bien vouloir trouver ci-joint votre facture pour règlement.</p><p>&nbsp;Nous restons à "
        + "votre disposition pour toute précision.</p><p>&nbsp;En vous remerciant "
        + "de votre confiance.</p><p>&nbsp;Bien cordialement</p><p>&nbsp;ATTS</p>";
    @JsonProperty("emailTemplateId")
    Integer id;
    @NotNull
    String name;
    @NotNull
    String content;
    User user;
}
