import { PassedInitialConfig } from 'angular-auth-oidc-client';

export const authConfig: PassedInitialConfig = {
  config: {
            authority: 'https://login.microsoftonline.com//v2.0',
            authWellknownEndpointUrl: 'https://login.microsoftonline.com/common/v2.0',
            redirectUrl: window.location.origin,
            clientId: 'please-enter-clientId',
            scope: 'please-enter-scopes', // 'openid profile offline_access ' + your scopes
            responseType: 'code',
            silentRenew: true,
            useRefreshToken: true,
            maxIdTokenIatOffsetAllowedInSeconds: 600,
            issValidationOff: false,
            autoUserInfo: false,
            customParamsAuthRequest: {
              prompt: 'select_account', // login, consent
            },
    }
}
