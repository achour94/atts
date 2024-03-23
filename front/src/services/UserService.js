import Keycloak from "keycloak-js";

const keycloakConfig = {
  realm: process.env.REACT_APP_KEYCLOAK_REALM,
  url: process.env.REACT_APP_KEYCLOAK_URL,
  clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
  sslRequired: "external",
  publicClient: true,
  confidentialPort: 0,
};

const _kc = new Keycloak(keycloakConfig);
_kc.onTokenExpired = () => {
  _kc
    .updateToken(1)
    .then(() => {
      console.log("token was refereshed!");
    })
    .catch(console.error);
};

let isKeycloakInitialized = false; // This variable will track the initialization status

/**
 * Initializes Keycloak instance and calls the provided callback function if successfully authenticated.
 *
 * @param onAuthenticatedCallback
 */
const initKeycloak = (onAuthenticatedCallback, onErrorCallback) => {
  _kc
    .init({
      onLoad: "check-sso",
      silentCheckSsoRedirectUri:
        window.location.origin + "/silent-check-sso.html",
      pkceMethod: "S256",
    })
    .then((authenticated) => {
      isKeycloakInitialized = true;
      onAuthenticatedCallback();
    })
    .catch((error) => {
      onErrorCallback(error);
    });
};

const isInitialized = () => isKeycloakInitialized;

const doLogin = _kc.login;

const doLogout = _kc.logout;

const getToken = () => _kc.token;

const getTokenParsed = () => _kc.tokenParsed;

const isLoggedIn = () => !!_kc.token;

const updateToken = (successCallback) =>
  _kc.updateToken(5).then(successCallback).catch(doLogin);

const getUsername = () => _kc.tokenParsed?.preferred_username;
const getUserInfo = () => _kc.loadUserInfo();

const getUserProfile = () => _kc.loadUserProfile();

const hasAtLeastOneRole = (roles) => {
  const resourceName = process.env.REACT_APP_KEYCLOAK_RESOURCE;
  return roles.some((role) => {
    return (
      _kc.tokenParsed &&
      _kc.tokenParsed.resource_access[resourceName] &&
      _kc.tokenParsed.resource_access[resourceName].roles.includes(role)
    );
  });
};

const hasAllRoles = (roles) => {
  const resourceName = process.env.REACT_APP_KEYCLOAK_RESOURCE;
  return roles.every((role) => {
    return (
      _kc.tokenParsed &&
      _kc.tokenParsed.resource_access[resourceName] &&
      _kc.tokenParsed.resource_access[resourceName].roles.includes(role)
    );
  });
};

const getRoles = () => {
  const resourceName = process.env.REACT_APP_KEYCLOAK_RESOURCE;
  return (
    (_kc.tokenParsed &&
      _kc.tokenParsed.resource_access[resourceName] &&
      _kc.tokenParsed.resource_access[resourceName].roles) ||
    []
  );
};

const UserService = {
  initKeycloak,
  isInitialized,
  doLogin,
  doLogout,
  isLoggedIn,
  getToken,
  getTokenParsed,
  updateToken,
  getUsername,
  hasAtLeastOneRole,
  hasAllRoles,
  getUserInfo,
  getRoles,
  getUserProfile,
};

export default UserService;
