import Keycloak from 'keycloak-js';

const keycloakConfig = {
    url: 'http://localhost:8080/auth', // Replace with your auth URL
    realm: 'react-keycloak',
    clientId: 'restClient',
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;