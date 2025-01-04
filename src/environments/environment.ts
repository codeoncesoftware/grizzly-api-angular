// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: '',
  url: location.origin + '/',
  grizzlyHubUrl: 'http://localhost:4300/login',
  GITHUB_AUTHORIZE_URL: 'https://github.com/login/oauth/authorize',
  GITHUB_REDIRECT_URI: location.origin + '/api/auth/github/login',
  GITHUB_CLIENT_ID: '93cdf656cc3009b2f259',
  GOOGLE_AUTHORIZE_URL: 'https://accounts.google.com/o/oauth2/v2/auth',
  GOOGLE_REDIRECT_URI: location.origin + '/google/login',
  GOOGLE_CLIENT_ID: '500148233470-rjvd625rirultfdcldlps5c2md5r0k7n.apps.googleusercontent.com',
  apiKey: 'userApiKeyForEditor',
  gtag_id: '',
  loginUrl : 'http://localhost:4900/login',
  authURL : 'http://localhost:4900/login',
  doc : 'https://grizzlydoc.codeonce.fr/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
