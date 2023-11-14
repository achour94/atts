package com.atts.tools.msystem.domain.ports.in.usecases;

public interface ManageInvoicesUseCase {
    void generateListOfClientsViaCsv(byte[] csvFile);
}
