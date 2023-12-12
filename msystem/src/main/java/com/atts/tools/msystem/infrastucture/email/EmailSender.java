package com.atts.tools.msystem.infrastucture.email;

import com.atts.tools.msystem.domain.model.InvoiceFile;
import com.atts.tools.msystem.domain.ports.out.smtp.EmailPort;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.util.ByteArrayDataSource;

import java.util.regex.Matcher;
import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EmailSender implements EmailPort {

    public static final String UTF_8 = "UTF-8";
    private final JavaMailSender emailSender;
    @Value("${spring.mail.username}")
    private String fromEmail;
    @Value("${frontend.host}")
    private String feHost;

    private final String HTML_PATTERN = "<(\"[^\"]*\"|'[^']*'|[^'\">])*>";
    private Pattern pattern = Pattern.compile(HTML_PATTERN);

    public boolean hasHTMLTags(String text){
        Matcher matcher = pattern.matcher(text);
        return matcher.find();
    }


    @Override
    @Async
    public void sendInvoice(String bodyText, InvoiceFile invoiceFile, String to) {
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper messageHelper = new MimeMessageHelper(message, true, UTF_8);

            messageHelper.setSubject(String.format("Invoice %s", invoiceFile.getFilename()));
            messageHelper.setFrom(fromEmail);
            messageHelper.setTo(to);
            messageHelper.setPriority(2);
            messageHelper.setText(bodyText, hasHTMLTags(bodyText));
            messageHelper.addAttachment(invoiceFile.getFilename(),
                new ByteArrayDataSource(invoiceFile.getContent(), "application/octet-stream"));
            emailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }

    }

    @Override
    @Async
    public void sendLoginMailToChangePassword(String user, String password, String to) {
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setSubject("Change Password");
        simpleMailMessage.setText(String.format(
            "Your temporary credentials are\n username:%s\npassword:%s\nLogin to %s to change your password", user,
            password, feHost));
        simpleMailMessage.setFrom(fromEmail);
        simpleMailMessage.setTo(to);
        emailSender.send(simpleMailMessage);
    }
}
