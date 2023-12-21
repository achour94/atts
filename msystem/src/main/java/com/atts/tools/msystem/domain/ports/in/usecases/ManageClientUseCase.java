package com.atts.tools.msystem.domain.ports.in.usecases;

import com.atts.tools.msystem.common.exceptions.types.IlegalRequestException;
import com.atts.tools.msystem.common.exceptions.types.NotFoundElementException;
import com.atts.tools.msystem.domain.model.Client;
import java.util.List;

public interface ManageClientUseCase {
    Client create(Client client) throws IlegalRequestException;
    Client update(Client client) throws IlegalRequestException;
    void delete(List<Integer> ids) throws NotFoundElementException;
}
