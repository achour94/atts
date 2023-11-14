package com.atts.tools.msystem.domain.services;

import com.atts.tools.msystem.common.annotations.UseCase;
import com.atts.tools.msystem.domain.ports.in.usecases.ManageInvoicesUseCase;

@UseCase
public class InvoiceService implements ManageInvoicesUseCase {
    @Override
    public void generateListOfClientsViaCsv(byte[] csvFile) {

    }
}
