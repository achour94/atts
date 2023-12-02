package com.atts.tools.msystem.domain.ports.in.usecases;

import java.util.List;

public interface ManageInvoicesUseCase {
    void generateInvoices(List<List<Object>> rows, String fileName);
}
