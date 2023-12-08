package com.atts.tools.msystem.infrastucture.generator.pdf;

import com.atts.tools.msystem.domain.model.Consumption;
import com.atts.tools.msystem.domain.model.Invoice;
import com.atts.tools.msystem.domain.model.Subscription;
import com.atts.tools.msystem.domain.model.contants.InvoiceConstants;
import com.atts.tools.msystem.domain.ports.out.file.FileGeneratorPort;

import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfPage;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Text;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.VerticalAlignment;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;


//TODO to be able to use this pdf generator for multiple companies we should extract
// some fields like watermark and company logo outside of this class
@Component
@RequiredArgsConstructor
public class ATTSPDFGenerator implements FileGeneratorPort {

    private final ResourceLoader resourceLoader;
    private final InvoiceExtractor invoiceExtractor;

    private void addHeader(Document document, Invoice invoice) {
        float twocolumnWidth[] = {300f, 300f};
        Table table = new Table(twocolumnWidth).setBorder(Border.NO_BORDER);
        try {
            Image companyHeaderImage = new Image(
                ImageDataFactory.create(resourceLoader.getResource("classpath:iplogLogo.png").getURL()));
            companyHeaderImage.scaleToFit(200, 200);
            table.addCell(new Cell().add(companyHeaderImage).setBorder(Border.NO_BORDER));

            String factureDateAndNumber = String.format("Facture OP/N°%s",
                invoiceExtractor.extractInvoiceNumberDate(invoice));
            Paragraph paragraph = new Paragraph(factureDateAndNumber).setTextAlignment(TextAlignment.RIGHT);
            paragraph.setFontSize(14f);
            paragraph.setBold();
            String publishedDate = String.format("Editée le %s",
                invoiceExtractor.extractDate(invoice.getCreationDate()));
            Cell rightCell = new Cell().add(paragraph)
                .add(new Paragraph(publishedDate).setTextAlignment(TextAlignment.RIGHT))
                .setHorizontalAlignment(HorizontalAlignment.RIGHT).setBorder(Border.NO_BORDER);
            table.addCell(rightCell);

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        document.add(table);
    }

    public void addClientSection(Document document, Invoice invoice) {
        float twocolumnWidth[] = {350, 250f};
        Table table = new Table(twocolumnWidth).setBorder(Border.NO_BORDER);

        Cell leftCell = new Cell();
        leftCell.add(new Paragraph("SARL ATTS"));
        leftCell.add(new Paragraph("2A rue du Général Leclerc"));
        leftCell.add(new Paragraph("59520 MARQUETTE-LEZ-LILLE"));
        leftCell.add(new Paragraph(" @ : contact@atts.fr"));
        leftCell.add(new Paragraph("téléphone : 03.59.25.09.10"));
        leftCell.setBorder(Border.NO_BORDER);
        table.addCell(leftCell);

        Cell rightCell = new Cell().setTextAlignment(TextAlignment.CENTER);
        Border solidBorder = new SolidBorder(new DeviceRgb(211, 211, 211), 1f);
        rightCell.add(new Paragraph(invoiceExtractor.extractClientMainData(invoice)).setBackgroundColor(
            new DeviceRgb(250, 252, 255)).setTextAlignment(TextAlignment.LEFT).setBorder(solidBorder));

        rightCell.add(new Paragraph("\n"));
        rightCell.add(new Paragraph(invoiceExtractor.extractRefClient(invoice)).setTextAlignment(TextAlignment.LEFT));
        rightCell.setBorder(Border.NO_BORDER);
        table.addCell(rightCell);
        document.add(table);

    }

    @Override
    public byte[] generateFile(Invoice invoice) {
        ByteArrayOutputStream pdfOS = new ByteArrayOutputStream();
        PdfWriter pdfWriter = new PdfWriter(pdfOS);
        PdfDocument pdfDocument = new PdfDocument(pdfWriter);
        pdfDocument.setDefaultPageSize(PageSize.A4);
        Document document = new Document(pdfDocument);
        document.setFontSize(10);
        addHeader(document, invoice);

        document.add(new Paragraph());
        document.add(new Paragraph());

        addClientSection(document, invoice);

        document.add(new Paragraph("\n\n"));
        addMainTableHeader(document);

        addDivider(document, new float[]{600f});

        addSubscriptionPeriod(document, invoice);
        addDivider(document, new float[]{600f});
        addSubscriptions(document, invoice);

        addConsumptionsHeader(document);
        addDivider(document, new float[]{600f});
        addConsumptions(document, invoice);

        document.add(new Paragraph("\n"));

        addTotal(document, invoice);

        document.add(new Paragraph("\n"));
        addBankInfo(document);

        addFooter(pdfDocument, document);
        if (invoice.getProforma()) {
            addWatermark(document);
        }
        document.close();
        byte[] pdf = pdfOS.toByteArray();
        try {
            pdfOS.close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return pdf;

    }

    private void addWatermark(Document document) {
        try {
            Paragraph watermark = createWatermarkParagraph("PROFORMA");
            for (int index = 1; index <= document.getPdfDocument().getNumberOfPages(); ++index) {
                addWatermarkToGeneratedPDF(document, index, watermark, 0f);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public Paragraph createWatermarkParagraph(String watermark) throws IOException {
        PdfFont font = PdfFontFactory.createFont(StandardFonts.HELVETICA);
        Text text = new Text(watermark);
        text.setFont(font);
        text.setFontSize(90);
        text.setOpacity(0.22f);
        return new Paragraph(text);
    }


    public void addWatermarkToGeneratedPDF(Document document, int pageIndex,
        Paragraph paragraph, float verticalOffset) {

        PdfPage pdfPage = document.getPdfDocument().getPage(pageIndex);
        PageSize pageSize = (PageSize) pdfPage.getPageSizeWithRotation();
        float x = (pageSize.getLeft() + pageSize.getRight()) / 2;
        float y = (pageSize.getTop() + pageSize.getBottom()) / 1.6f;
        float xOffset = 100f / 2;
        float rotationInRadians = (float) (Math.PI / 180 * 45f);
        document.showTextAligned(paragraph, x - xOffset, y + verticalOffset,
            pageIndex, TextAlignment.CENTER, VerticalAlignment.TOP, rotationInRadians);
    }

    @Override
    public String getFileType() {
        return "pdf";
    }

    private void addFooter(PdfDocument pdfDocument, Document document) {
        int nrOfPages = pdfDocument.getNumberOfPages();
        for (int index = 1; index <= nrOfPages; ++index) {
            Table table = new Table(new float[]{525f});
            Cell mainCell = new Cell().setBorder(Border.NO_BORDER);
            Paragraph textInfoParagraph = new Paragraph(
                "En cas de paiement anticipé, aucun escompte ne sera accordé. Délai de paiement : loi de paiement n° 92-1442 du "
                    + "31/12/1992, application d'une pénalité de retard d'un taux égal à 1 fois et demi le taux d'intérêt légal. Le montant de "
                    + "l'indemnité forfaitaire pour frais de recouvrement due au créancier en cas de retard de paiement est fixée à 40 € *TVA payée "
                    + "sur les encaissements");
            Paragraph nrPageParagraph = new Paragraph(String.format("page %s sur %s", index,
                pdfDocument.getNumberOfPages()));
            mainCell.add(textInfoParagraph.setTextAlignment(TextAlignment.LEFT))
                .add(getBlackDivider(525f)).add(nrPageParagraph.setTextAlignment(TextAlignment.RIGHT));
            mainCell.add(new Paragraph("SARL ATTS").setTextAlignment(TextAlignment.CENTER));
            mainCell.add(new Paragraph("SIREN 845306604 - RCS LILLE METROPOLE - NAF 4321A").setTextAlignment(
                TextAlignment.CENTER));
            mainCell.add(
                new Paragraph("TVA intracommunautaire : FR33845306604").setTextAlignment(TextAlignment.CENTER));

            table.addCell(mainCell);

            table.setFixedPosition(index, 35f, 10f, 525f);
            document.add(table);
        }
    }

    private void addBankInfo(Document document) {
        Paragraph infoTitleParagraph = new Paragraph("Informations bancaires :").setTextAlignment(TextAlignment.LEFT)
            .setBold();
        Paragraph ibanPargraph = new Paragraph("IBAN : FR7630027170400002060560272").setTextAlignment(
            TextAlignment.LEFT);
        Paragraph bicParagraph = new Paragraph("BIC : CMCIFRPPXXX").setTextAlignment(TextAlignment.LEFT);

        Table tableBankInfo = new Table(new float[]{600f});
        Cell mainCell = new Cell().setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.LEFT);
        mainCell.add(infoTitleParagraph).add(getGrayDividerWithWidth(600f)).add(new Paragraph("\n").setFontSize(4f))
            .add(ibanPargraph)
            .add(bicParagraph);
        tableBankInfo.addCell(mainCell);
        document.add(tableBankInfo);


    }

    private void addTotal(Document document, Invoice invoice) {
        Table table = new Table(new float[]{350f, 250f});
        table.addCell(new Cell().setBorder(Border.NO_BORDER));

        Cell totalCell = new Cell().setBorder(Border.NO_BORDER);
        addTwoColumnsTotalTable(totalCell, "Total HT *", String.valueOf(invoice.getHttAmount()), false);
        addTwoColumnsTotalTable(totalCell,
            String.format("TVA %s", String.valueOf(InvoiceConstants.TVA)) + "%",
            String.valueOf(invoice.getTtcAmount() - invoice.getHttAmount()), false);
        addTwoColumnsTotalTable(totalCell, "Total TTC", String.valueOf(invoice.getTtcAmount()) + " €", true);
        table.addCell(totalCell);

        document.add(table);
    }

    private void addTwoColumnsTotalTable(Cell totalCell, String coulmn1, String column2, boolean withBold) {
        Table table = new Table(new float[]{20f, 105f, 125f});
        table.addCell(new Cell().setBorder(Border.NO_BORDER));
        Paragraph firstParahgraph = new Paragraph(coulmn1).setTextAlignment(TextAlignment.LEFT);
        if (withBold) {
            firstParahgraph.setBold();
        }
        table.addCell(
            new Cell().add(firstParahgraph).setBorder(Border.NO_BORDER)
                .setTextAlignment(TextAlignment.LEFT));
        Paragraph secondParagraph = new Paragraph(column2).setTextAlignment(TextAlignment.RIGHT);
        if (withBold) {
            secondParagraph.setBold();
        }
        table.addCell(
            new Cell().add(secondParagraph).setBorder(Border.NO_BORDER)
                .setTextAlignment(TextAlignment.RIGHT));

        totalCell.add(table);
        totalCell.add(getGrayDividerWithWidth(250f));
    }

    public void addConsumptions(Document document, Invoice invoice) {
        for (Consumption consumption : invoice.getConsumptions()) {
            addSubtableWithFourColumn(document, invoiceExtractor.extractConsumptionPeriod(consumption),
                String.valueOf(consumption.getConsumptionCount()),
                invoiceExtractor.extractHHMMSSFromSeconds(consumption.getConsumptionDuration()),
                String.valueOf(consumption.getHtAmount()));
        }
    }

    public void addSubtableWithFourColumn(Document document, String col1, String col2, String col3, String col4) {
        Table table = new Table(new float[]{20f, 280f, 100f, 100f, 100f});
        table.addCell(new Cell().setBorder(Border.NO_BORDER));
        table.addCell(new Cell().setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.LEFT).add(
            new Paragraph().add(col1)));
        table.addCell(new Cell().setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.CENTER).add(
            new Paragraph(col2)).setTextAlignment(
            TextAlignment.CENTER));
        table.addCell(new Cell().setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.CENTER).add(
            new Paragraph(col3)).setTextAlignment(
            TextAlignment.CENTER));
        table.addCell(new Cell().setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.RIGHT).add(
            new Paragraph(col4)).setTextAlignment(
            TextAlignment.RIGHT));

        document.add(table);
        addDivider(document, new float[]{600f});
    }

    public void addConsumptionsHeader(Document document) {
        Table table = new Table(new float[]{300, 100f, 200f});
        table.addCell(new Cell().setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.LEFT).add(
            new Paragraph("Consommations Téléphoniques").setTextAlignment(
                TextAlignment.LEFT)));
        table.addCell(new Cell().setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.CENTER).add(
            new Paragraph("Nbr. d'appels").setTextAlignment(
                TextAlignment.CENTER)));
        table.addCell(new Cell().setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.LEFT).add(
            new Paragraph("Durée des appels").setTextAlignment(
                TextAlignment.LEFT)));
        document.add(table);
    }

    private void addSubscriptions(Document document, Invoice invoice) {
        addContentSubtableWithTwoColumns(document, "Abonnement communication",
            String.valueOf(invoice.getClient().getDefaultSubscription()));
        if (invoice.getClient().getActiveDiverse()) {
            addContentSubtableWithTwoColumns(document, "Abonnement, offre fibre/xdsl",
                String.valueOf(invoice.getClient().getDiverseSubscription()));
        }
        if (invoice.getClient().getSubscriptionList() != null) {
            for (Subscription subscription : invoice.getClient().getSubscriptionList()) {
                addContentSubtableWithTwoColumns(document, subscription.getName(),
                    String.valueOf(subscription.getPrice()));
            }
        }
    }

    private void addContentSubtableWithTwoColumns(Document document, String leftString, String rightString) {
        Table table = new Table(new float[]{20f, 300f, 280f});
        table.addCell(new Cell().setBorder(Border.NO_BORDER));
        table.addCell(new Cell().setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.LEFT).add(
            new Paragraph().add(leftString)));
        table.addCell(new Cell().setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.RIGHT).add(
            new Paragraph(rightString)).setTextAlignment(
            TextAlignment.RIGHT));

        document.add(table);
        addDivider(document, new float[]{600f});
    }

    private void addMainTableHeader(Document document) {

        Cell leftCell = new Cell().setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.LEFT)
            .add(new Paragraph("TELEPHONIE Fixe").setTextAlignment(TextAlignment.LEFT).setBold());

        Cell rightCell = new Cell().setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.RIGHT)
            .add(new Paragraph("Montant € HT").setTextAlignment(TextAlignment.RIGHT));

        Table table = new Table(new float[]{300f, 300f});
        table.addCell(leftCell).addCell(rightCell);

        document.add(table);
    }

    private void addDivider(Document document, float[] width) {
        Border gb = new SolidBorder(new DeviceRgb(211, 211, 211), 1f / 3f);
        Table divider = new Table(width);
        divider.setBorder(gb);
        document.add(divider);
    }

    Table getGrayDividerWithWidth(float width) {
        Border gb = new SolidBorder(new DeviceRgb(211, 211, 211), 1f / 3f);
        Table divider = new Table(new float[]{width});
        divider.setBorder(gb);
        return divider;
    }

    Table getBlackDivider(float width) {
        Border gb = new SolidBorder(new DeviceRgb(0, 0, 0), 1f / 3f);
        Table divider = new Table(new float[]{width});
        divider.setBorder(gb);
        return divider;
    }


    public void addSubscriptionPeriod(Document document, Invoice invoice) {
        Table table = new Table(new float[]{800f});
        table.addCell(new Cell().setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.LEFT).add(
            new Paragraph(String.format("Abonnements %s", invoiceExtractor.extractPeriod(invoice))).setTextAlignment(
                TextAlignment.LEFT)));

        document.add(table);
    }

}
