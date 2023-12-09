package com.atts.tools.msystem.infrastucture.storage;

import com.atts.tools.msystem.domain.model.InvoiceFile;
import com.atts.tools.msystem.domain.ports.out.storage.IFileStorage;
import jakarta.annotation.PostConstruct;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import org.springframework.stereotype.Component;

@Component
public class LocalStorage implements IFileStorage {

    private final String invoicesFolder = "./invoices";

    @PostConstruct
    public void init() {
        File file = new File(invoicesFolder);
        if (!file.exists()) {
            file.mkdir();
        }
    }

    @Override
    public void saveInvoice(InvoiceFile invoiceFile) {
        String location = invoicesFolder + "/" + invoiceFile.getFilename();
        File invoice = new File(location);
        if (!invoice.exists()) {
            try {
                invoice.createNewFile();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
        try (FileOutputStream outputStream = new FileOutputStream(invoice)) {
            outputStream.write(invoiceFile.getContent());
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public InvoiceFile getInvoice(String filename) {
        File file = new File(invoicesFolder + "/" + filename);
        try (FileInputStream in = new FileInputStream(file)) {
            return InvoiceFile.builder().filename(file.getName())
                .content(in.readAllBytes()).build();
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
