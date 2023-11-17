import Keycloak from "keycloak-js";

const _kc = new Keycloak('/keycloak.json');
_kc.onTokenExpired = () => {
    _kc.updateToken(1).then(() => {
        console.log("token was refereshed!");
    }).catch(console.error);
}

/**
 * Initializes Keycloak instance and calls the provided callback function if successfully authenticated.
 *
 * @param onAuthenticatedCallback
 */
const initKeycloak = (onAuthenticatedCallback) => {
  _kc.init({
    onLoad: 'check-sso',
    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
    pkceMethod: 'S256',
  })
    .then((authenticated) => {
        onAuthenticatedCallback();
    })
    .catch(console.error);
};

const doLogin = _kc.login;

const doLogout = _kc.logout;

const getToken = () => _kc.token;

const getTokenParsed = () => _kc.tokenParsed;

const isLoggedIn = () => !!_kc.token;

const updateToken = (successCallback) =>
  _kc.updateToken(5)
    .then(successCallback)
    .catch(doLogin);

const getUsername = () => _kc.tokenParsed?.preferred_username;

const hasAtLeastOneRole = (roles) => roles.some((role) => {
    return _kc.tokenParsed && _kc.tokenParsed.resource_access["atts-application"].roles.includes(role);
    });

const hasAllRoles = (roles) => roles.every((role) => {
    return _kc.tokenParsed.resource_access["atts-application"].roles.includes(role);
    });

const UserService = {
  initKeycloak,
  doLogin,
  doLogout,
  isLoggedIn,
  getToken,
  getTokenParsed,
  updateToken,
  getUsername,
  hasAtLeastOneRole,
  hasAllRoles
};

export default UserService;
