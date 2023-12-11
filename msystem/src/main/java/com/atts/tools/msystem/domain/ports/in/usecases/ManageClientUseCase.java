package com.atts.tools.msystem.domain.ports.in.usecases;

import com.atts.tools.msystem.domain.model.Client;

public interface ManageClientUseCase {
    Client create(Client client);
    Client update(Client client);
    void delete(Integer id);
}
