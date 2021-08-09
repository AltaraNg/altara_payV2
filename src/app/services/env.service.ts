import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {
  // API_URL = 'http://localhost:8003/api.php?action=';
  // API_URL = 'http://localhost/AltaraCredit/altara-api/api.php?action=';
  API_URL = 'https://altara-api.herokuapp.com/api.php?action=';
  // NEW_API_URL = "https://altara-prod-api.herokuapp.com"
  NEW_API_URL = "https://altara-play-api.herokuapp.com"


  PAYSTACK_CUSTOMER_API = 'https://api.paystack.co/customer';
  PAYSTACK_CUSTOMER_VERIFY = 'https://api.paystack.co/transaction/verify/';

  constructor() { }
}
