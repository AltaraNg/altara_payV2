// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false
};

export const NEW_API_URL = "https://altara-play-api.herokuapp.com";
export const PAYSTACK_CUSTOMER_API = 'https://api.paystack.co/customer';
export const PAYSTACK_CUSTOMER_VERIFY = 'https://api.paystack.co/transaction/verify/';
export const API_URL = 'https://altara-api.herokuapp.com/api.php?action=';


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
