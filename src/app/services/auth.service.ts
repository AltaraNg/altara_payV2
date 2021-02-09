import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, map } from 'rxjs/operators';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { EnvService } from './env.service';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { ToastController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { LoaderService } from '../loader.service';

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
  key: any;


  constructor(
    private http: HttpClient,
    private storage: NativeStorage,
    private env: EnvService,
    private router: Router,
    private toastController: ToastController,
    private platform: Platform,
    private ionLoader: LoaderService

  ) { }


  login(email: String, password: String) {
    return this.http.post(this.env.NEW_API_URL + '/api/login',
      { staff_id: email, password: password }
    ).pipe(
      // tap(user => { user
      //   return user;
      // })
      map(data => {
        this.data = data;
        console.log(this.data);
        localStorage.setItem('token', this.data.api_token);
        localStorage.setItem('branchId', this.data.api_branch_id);
        this.token = this.data.api_token;
        this.isLoggedIn = true;
        return this.data;
      })
    )
  }

  comfirmId(id: number) {
    this.ionLoader.showLoader();
    return this.http.post(this.env.API_URL + 'checkId',
      { Customer_id: id }
    ).pipe(
      tap(data => {
        this.ionLoader.hideLoader();
        return data;
      })
    )
  }

  updatesCustomerInfo(id: Number, email: String, firstName: String, middleName: String, lastName: String, phoneNo: String, dateOfBirth: String, sector: String,
    occupation: String, company: String, income: String, household: String
  ) {
    this.ionLoader.showLoader();
    return this.http.post(this.env.API_URL + 'updateCustInfo',
      {
        id: id, email: email, firstName: firstName, middleName: middleName, lastName: lastName, phoneNo: phoneNo, dateOfBirth: dateOfBirth, sector: sector,
        occupation: occupation, company: company, income: income, household: household
      }
    ).pipe(
      tap(data => {
        this.ionLoader.hideLoader();
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
    // this.ionLoader.showLoader();

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
        // this.ionLoader.hideLoader();
        return data;
      })
    )
  }

  comfirmProduct(productSku: String) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    let options = { headers: headers };

    return this.http.get(this.env.NEW_API_URL + `/api/inventory?productName=${productSku}`,
      options
    ).pipe(
      tap(data => {
        return data;
      })
    )
  }

  createCustomer(id: Number, email: String, firstName: String, lastName: String, phoneNo: String, key: string) {
    let tokenStr = key;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenStr}`
    });
    let options = { headers: headers };
    this.ionLoader.showLoader();

    return this.http.post(this.env.PAYSTACK_CUSTOMER_API,
      { email: email, first_name: firstName, last_name: lastName, phone: phoneNo, metadata: { customerId: id } }, options,
    ).pipe(
      tap(data => {
        this.ionLoader.hideLoader();
        console.log(data);
        return data;
      })
    )
  }

  paystackCustomer(id: Number, customer_code: String,) {
    this.ionLoader.showLoader();
    return this.http.post(this.env.API_URL + 'paystackCustomerData',
      { id: id, customer_code: customer_code }
    ).pipe(
      tap(data => {
        this.ionLoader.hideLoader();
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
    this.ionLoader.showLoader();

    return this.http.post(this.env.API_URL + 'purchase',
      order
    ).pipe(
      tap(data => {
        this.ionLoader.hideLoader();

        return data;
      })
    )
  }

  logAuthcode(order_id: any, auth_code: any) {
    this.ionLoader.showLoader();

    return this.http.post(this.env.API_URL + 'paystackauthcode',
      { order_id: order_id, auth_code: auth_code }
    ).pipe(
      tap(data => {
        this.ionLoader.hideLoader();

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
    // this.ionLoader.showLoader();

    return this.http.post(this.env.API_URL + 'lastReciept',
      { branch_id: this.branch_id }
    ).pipe(
      tap(data => {
        console.log('getLastreceipt ', data);
        // this.ionLoader.hideLoader();

        return data;
      })
    )
  }

  getOrderList(customer_id) {
    this.ionLoader.showLoader();

    return this.http.post(this.env.API_URL + 'receiptID',
      { customer_id: customer_id }
    ).pipe(
      tap(data => {
        this.ionLoader.hideLoader();

        return data;
      })
    )
  }

  getkey(key_type) {
    // this.ionLoader.showLoader();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    let options = { headers: headers };
    return this.http.get(this.env.NEW_API_URL + '/api/dd_k', options
    ).pipe(
      tap(data => {
        return data;
      })
    )
  }

  generateAuthKey(ref: any, key) {
    let tokenStr = key;
    this.ionLoader.showLoader();

    return this.http.get(this.env.PAYSTACK_CUSTOMER_VERIFY + ref + "", { headers: { "Authorization": `Bearer ${tokenStr}` } }
    ).pipe(
      tap(data => {
        this.ionLoader.hideLoader();
        console.log(data);
        return data;
      })
    )
  }

  updateRepayment(repay: any) {
    this.ionLoader.showLoader();

    return this.http.post(this.env.API_URL + 'formal_repay',
      repay
    ).pipe(
      tap(data => {
        this.ionLoader.hideLoader();
        return data;
      })
    )
  }



}

