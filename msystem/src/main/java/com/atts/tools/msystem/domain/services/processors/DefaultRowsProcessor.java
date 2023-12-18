package com.atts.tools.msystem.domain.services.processors;

import com.atts.tools.msystem.common.exceptions.types.ProcessException;
import com.atts.tools.msystem.domain.model.Consumption;
import com.atts.tools.msystem.domain.model.ConsumptionType;
import com.atts.tools.msystem.domain.model.contants.InvoiceConstants;
import com.atts.tools.msystem.domain.model.types.ClientReference;
import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import org.springframework.stereotype.Component;

@Component
public class DefaultRowsProcessor {

    public static class RowExtractor {

        public static ConsumptionType consumptionType(List<Object> row) throws ProcessException {
            try {
                return ConsumptionType.convert((String) row.get(2));
            } catch (IllegalAccessException e) {
                throw new ProcessException("bad consumption type column");
            }
        }

        public static ClientReference clientReference(List<Object> row) throws ProcessException {
            try {
                String referenceClient = (String) row.get(21);
                Objects.requireNonNull(referenceClient);
                return new ClientReference(referenceClient.replaceAll("[^0-9]", ""));
            } catch (IndexOutOfBoundsException err) {
                throw new ProcessException("client reference column doesn't exist");
            } catch (NullPointerException err) {
                throw new ProcessException("client reference is null");
            }
        }


        public static String clientName(List<Object> row) throws ProcessException {
            try {
                return Objects.requireNonNull((String) row.get(20));
            } catch (IndexOutOfBoundsException err) {
                throw new ProcessException("client name column doesn't exist");
            } catch (NullPointerException err) {
                throw new ProcessException("client name is null");
            }
        }

        public static String clientAddress(List<Object> row) throws ProcessException {
            try {
                return Objects.requireNonNull((String) row.get(19));
            } catch (IndexOutOfBoundsException err) {
                throw new ProcessException("client address column doesn't exist");
            } catch (NullPointerException err) {
                throw new ProcessException("client reference is null");
            }
        }

        public static Double tva(List<Object> row) {
            return row.get(12) == null ? InvoiceConstants.TVA : (Double) row.get(12);
        }

        public static Date startPeriod(List<Object> row) throws ProcessException {
            try {
                Date date = (Date) row.get(13);
                return date == null ? Date.valueOf(LocalDate.now().minusMonths(1).withDayOfMonth(1)) : date;
            } catch (IndexOutOfBoundsException err) {
                throw new ProcessException("start period column doesn't exist");
            }
        }

        public static Date endPeriod(List<Object> row) throws ProcessException {
            try {
                Date date = (Date) row.get(14);
                return date == null ? Date.valueOf(LocalDate.now().withDayOfMonth(1).minusDays(1)) : date;
            } catch (IndexOutOfBoundsException err) {
                throw new ProcessException("end period column doesn't exist");
            }
        }

        public static Integer consumptionDuration(List<Object> row) throws ProcessException {
            try {
                return (((Double) row.get(17)).intValue());
            } catch (IndexOutOfBoundsException err) {
                throw new ProcessException("consumption duration column doesn't exist");
            } catch (NullPointerException err) {
                throw new ProcessException("consumption duration is null");
            }
        }

        public static Double htAmount(List<Object> row) throws ProcessException {
            try {
                return Objects.requireNonNull((Double) row.get(8));
            } catch (IndexOutOfBoundsException err) {
                throw new ProcessException("ht amount column doesn't exist");
            } catch (NullPointerException err) {
                throw new ProcessException("ht amount count is null");
            }
        }

        public static Integer consumptionCount(List<Object> row) throws ProcessException {
            try {
                return ((Double) (row.get(15) == null ? 1.0 : row.get(15))).intValue();
            } catch (IndexOutOfBoundsException err) {
                throw new ProcessException("consumption count column doesn't exist");
            } catch (NullPointerException err) {
                throw new ProcessException("consumption count is null");
            }
        }
    }

    /**
     * This method extract from rows the most important data for clients
     *
     * @param rows a list of rows where each keep a consumption for a client(there can be multiple consumption for the
     *             same client)
     * @return {@link ClientsResults}
     */
    public ClientsResults process(List<List<Object>> rows) {
        Map<ClientReference, ClientSummary> clientsSummary = new HashMap<>();
        List<ProcessError> errors = new ArrayList<>();
        //TODO manage startDate > endDate
        for (int rowNumber = 0; rowNumber < rows.size(); ++rowNumber) {
            List<Object> row = rows.get(rowNumber);
            try {
                ClientReference clientReference = RowExtractor.clientReference(row);
                String clientName = RowExtractor.clientName(row);
                String address = RowExtractor.clientAddress(row);
                Date startPeriod = RowExtractor.startPeriod(row);
                Date endPeriod = RowExtractor.endPeriod(row);
                ConsumptionType type = RowExtractor.consumptionType(row);
                Integer consumptionDuration = RowExtractor.consumptionDuration(row);
                Integer consumptionCount = RowExtractor.consumptionCount(row);
                Double htAmount = RowExtractor.htAmount(row);
                Double tva = RowExtractor.tva(row);
                Consumption consumption = Consumption.builder().consumptionCount(consumptionCount)
                    .consumptionDuration(consumptionDuration).type(type).startDate(startPeriod).htAmount(htAmount)
                    .endDate(endPeriod)
                    .build();
                if (clientsSummary.containsKey(clientReference)) {
                    ClientSummary summary = clientsSummary.get(clientReference);
                    summary.getConsumptions().add(consumption);
                    if (!Objects.equals(tva, summary.getTva()))
                        throw new ProcessException("You cannot have different tva for the same invoice!");

                } else {
                    clientsSummary.put(clientReference,
                        ClientSummary.builder()
                            .address(address).name(clientName).tva(tva).consumptions(new ArrayList<>(List.of(consumption)))
                            .build());
                }

            } catch (ProcessException e) {
                errors.add(new ProcessError(rowNumber, e.getMessage()));
            }
        }
        return ClientsResults.builder().clientsSummary(clientsSummary).errors(errors).build();
    }

}
