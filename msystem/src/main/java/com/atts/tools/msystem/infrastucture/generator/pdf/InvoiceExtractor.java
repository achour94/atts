package com.atts.tools.msystem.infrastucture.generator.pdf;

import com.atts.tools.msystem.domain.model.Consumption;
import com.atts.tools.msystem.domain.model.Invoice;
import java.sql.Date;
import java.time.Duration;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

@Component
public class InvoiceExtractor {

    public String extractInvoiceNumberDate(Invoice invoice) {
        StringBuilder builder = new StringBuilder();
        builder.append(extractDate(invoice.getCreationDate()));
        builder.append("-");
        String invoiceNumber = String.valueOf(invoice.getId());
        builder.append(StringUtils.leftPad(invoiceNumber, 6, "0"));
        return builder.toString();
    }

    public String extractClientMainData(Invoice invoice) {
        StringBuilder builder = new StringBuilder();
        builder.append("Point de facturation:");
        builder.append("\n");
        builder.append(" " + invoice.getClient().getName());
        builder.append("\n");
        builder.append(" " + invoice.getClient().getAddress() + ", " + (invoice.getClient().getPostalCode() != null
            ? invoice.getClient().getPostalCode() : ""));
        return builder.toString();
    }

    public String extractHHMMSSFromSeconds(long seconds) {
        Duration duration = Duration.ofSeconds(seconds);
        String hh = String.valueOf(duration.toHoursPart());
        String mm = String.valueOf(duration.toMinutesPart());
        String ss = String.valueOf(duration.toSecondsPart());
        return String.format("%sh %sm %ss", hh, mm, ss);
    }

    public String extractConsumptionPeriod(Consumption consumption) {
        StringBuilder builder = new StringBuilder();
        builder.append(consumption.getType().getLabel());
        builder.append(" [Période du ");
        builder.append(extractDate(consumption.getStartDate()));
        builder.append(" au ");
        builder.append(extractDate(consumption.getEndDate()));
        builder.append("]");
        return builder.toString();
    }

    public String extractPeriod(Invoice invoice) {
        StringBuilder builder = new StringBuilder();
        builder.append("[Période du ");
        builder.append(extractDate(invoice.getStartPeriod()));
        builder.append(" au ");
        builder.append(extractDate(invoice.getEndPeriod()));
        builder.append("]");
        return builder.toString();
    }

    public String extractRefClient(Invoice invoice) {
        StringBuilder builder = new StringBuilder();
        builder.append("Réf. client : ");
        builder.append(invoice.getClient().getClientReference().reference());
        return builder.toString();
    }


    public String extractDate(Date date) {
        return date.toString();
    }

}
