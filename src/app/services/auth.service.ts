import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, map } from 'rxjs/operators';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { EnvService } from './env.service';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { ToastController } from '@ionic/angular';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  isLoggedIn = false;
  token: any;
  data: any;
  customerInfo: any;
  isCustomerValid = false;
  productData: any;
  isProductValid = false;
  id: any;
  branch_id: any;


  constructor(
    private http: HttpClient,
    private storage: NativeStorage,
    private env: EnvService,
    private router: Router,
    private toastController: ToastController,
    private platform: Platform
  ) { }


  login(email: String, password: String) {
    return this.http.post(this.env.API_URL + 'login',
      { Employee_id: email, Access_code: password }
    ).pipe(
      // tap(user => { user
      //   return user;
      // })
      map(data => {
        this.data = data;
        console.log(this.data);
        if (this.data.error == false && this.data.user !== undefined) {
          this.platform.ready().then(() => {
            this.storage.setItem('token', this.data.token)
              .then(
                () => {
                  console.log('Token Stored');
                },
                error => console.error('Error storing item', error)
              );
          });

          this.platform.ready().then(() => {
            this.storage.setItem('id', email)
              .then(
                () => {
                  console.log('Id Stored');
                },
                error => console.error('Error storing item', error)
              );
          });

          this.token = this.data.token;
          this.isLoggedIn = true;
          return this.data.user;
        }
        else { this.isLoggedIn = false; }
      })
    )
  }

  comfirmId(id: number) {
    return this.http.post(this.env.API_URL + 'checkId',
      { Customer_id: id }
    ).pipe(
      tap(data => {
        return data;
      })
    )
  }

  updatesCustomerInfo(id: Number, email: String, firstName: String, middleName: String, lastName: String, phoneNo: String, dateOfBirth: String, sector: String,
    occupation: String, company: String, income: String, household: String
  ) {

    return this.http.post(this.env.API_URL + 'updateCustInfo',
      {
        id: id, email: email, firstName: firstName, middleName: middleName, lastName: lastName, phoneNo: phoneNo, dateOfBirth: dateOfBirth, sector: sector,
        occupation: occupation, company: company, income: income, household: household
      }
    ).pipe(
      tap(data => {
        return data;
      })
    )
  }

  pushDDdata(
    customer_id: Number,
    order_id: String,
    salaryDay: Number,
    salaryDay2: Number,
    salaryDay3: Number,
    salaryProof: String,
    guarantorSigned: String,
    addressVisited: String,
    creditReport: String,
    creditPoints: String,
    mode: any
  ) {

    return this.http.post(this.env.API_URL + 'dd_data',
      {
        customer_id: customer_id,
        order_id: order_id,
        salaryDay: salaryDay,
        salaryDay2: salaryDay2,
        salaryDay3: salaryDay3,
        salaryProof: salaryProof,
        guarantorSigned: guarantorSigned,
        addressVisited: addressVisited,
        creditReport: creditReport,
        creditPoints: creditPoints,
        mode: mode
      }
    ).pipe(
      tap(data => {
        return data;
      })
    )
  }

  comfirmProduct(productSku: String) {
    return this.http.post(this.env.API_URL + 'checkprod',
      { product_sku: productSku }
    ).pipe(
      tap(data => {
        return data;
      })
    )
  }

  createCustomer(id: Number, email: String, firstName: String, lastName: String, phoneNo: String) {
    let tokenStr = 'sk_live_b7171d72637';
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenStr}`
    });
    let options = { headers: headers };

    return this.http.post(this.env.PAYSTACK_CUSTOMER_API,
      { email: email, first_name: firstName, last_name: lastName, phone: phoneNo, metadata: { customerId: id } }, options,
    ).pipe(
      tap(data => {
        console.log(data);
        return data;
      })
    )
  }

  paystackCustomer(id: Number, customer_code: String, ) {
    return this.http.post(this.env.API_URL + 'paystackCustomerData',
      { id: id, customer_code: customer_code }
    ).pipe(
      tap(data => {
        return data;
      })
    )
  }

  logout() {
    this.storage.remove("token");
    this.storage.remove("id");
    this.storage.remove("branch_id");
    this.isLoggedIn = false;
    delete this.token;
  }

  postOrder(order: any) {
    return this.http.post(this.env.API_URL + 'purchase',
      order
    ).pipe(
      tap(data => {
        return data;
      })
    )
  }

  logAuthcode(order_id: any, auth_code: any) {
    return this.http.post(this.env.API_URL + 'paystackauthcode',
      { order_id: order_id, auth_code: auth_code }
    ).pipe(
      tap(data => {
        return data;
      })
    )
  }

  get user() {
    return this.user;
  }

  getToken() {
    return this.storage.getItem('token').then(
      data => {
        this.token = data;

        if (this.token != null) {
          this.isLoggedIn = true;
        } else {
          this.isLoggedIn = false;
        }
      },
      error => {
        this.token = null;
        this.isLoggedIn = false;
      }
    );
  }

  getEpId() {
    return this.storage.getItem('id').then(
      data => {
        console.log(data);
        this.id = data;
        console.log(this.id);
      },
      error => {
        this.id = null;
      }
    );
  }

  getBranchId() {
    return this.storage.getItem('branch_id').then(
      data => {
        console.log(data);
        this.branch_id = data;
      },
      error => {
        this.id = null;
      }
    );
  }

  getLastreceipt() {
    return this.http.post(this.env.API_URL + 'lastReciept',
      { branch_id: this.branch_id }
    ).pipe(
      tap(data => {
        return data;
      })
    )
  }

  getOrderList(customer_id) {
    return this.http.post(this.env.API_URL + 'receiptID',
      { customer_id: customer_id }
    ).pipe(
      tap(data => {
        return data;
      })
    )
  }

  generateAuthKey(ref: any) {
    let tokenStr = 'sk_live_b2b01d72637';
    return this.http.get(this.env.PAYSTACK_CUSTOMER_VERIFY + ref + "", { headers: { "Authorization": `Bearer ${tokenStr}` } }
    ).pipe(
      tap(data => {
        console.log(data);
        return data;
      })
    )
  }

  updateRepayment(repay: any) {
    return this.http.post(this.env.API_URL + 'formal_repay',
      repay
    ).pipe(
      tap(data => {
        return data;
      })
    )
  }
}

