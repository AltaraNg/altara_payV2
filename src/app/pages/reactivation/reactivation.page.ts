import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from "@ionic/angular";
import { AuthService } from "../../services/auth.service";
import { User } from "../../models/user";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { MatStepper } from "@angular/material/stepper";
import { AlertService } from "../../services/alert.service";
import { NativeStorage } from "@ionic-native/native-storage/ngx";
import { Platform } from "@ionic/angular";
import { getLocaleExtraDayPeriods } from '@angular/common';
@Component({
  selector: 'app-reactivation',
  templateUrl: './reactivation.page.html',
  styleUrls: ['./reactivation.page.scss'],
})
export class ReactivationPage implements OnInit {
  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  customerData: any;
  orderData : any;
  orderIds:any;
  email:string;
  ref: any;
  key:any;
  sKey:any;
  pKey:any;
  constructor(
    private _formBuilder: FormBuilder,
    private menu: MenuController,
    private authService: AuthService,
    private alertService: AlertService,
    private platform: Platform,
    private storage: NativeStorage,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      customerId: ["", Validators.required]
    });

    this.secondFormGroup = this._formBuilder.group({
      id: ["", Validators.required]
    });
  }

  ionViewWillEnter() {
    this.getPkey('public');
    this.getSkey('secret');
  }

    getPkey(key_type:string){
      this.authService.getkey(key_type).subscribe(
        key => {
         this.key = key;
         this.pKey = this.key.checklist[0].key;
        }
      );
    }

    getSkey(key_type:string){
      this.authService.getkey(key_type).subscribe(
        key => {
         this.key = key;
         this.sKey = this.key.checklist[0].key;
        }
      );
    }

  checkId(stepper: MatStepper) {
    this.authService
      .comfirmId(this.firstFormGroup.value.customerId)
      .subscribe(result => {
        console.log(result);
        this.customerData = result;
        if (this.customerData.checklist.length === 0) {
          this.alertService.presentToast("Invalid Customer ID");
        } else {
          this.email = this.customerData.checklist[0].email
          this.getOrderIds(stepper)
      }
  });
}
 
  getOrderIds(stepper: MatStepper){
    this.ref = Math.floor(Math.random() * 1000000000 + 1);
    this.authService.getOrderList(this.firstFormGroup.value.customerId)
          .subscribe(res => {
            console.log(res);
            this.orderData = res;
            if (this.orderData.id.length === 0) {
              this.alertService.presentToast("No Sales record found!");
            } else {
              this.orderIds = this.orderData.id
              stepper.next();
            }
        });
  } 

  confirmData(stepper: MatStepper){
    if ( this.secondFormGroup.value.id != ''){
      stepper.next();
    }
    else {
      this.alertService.presentToast("Select order ID!");
    }
    
  }

  pushauthCode(order_id: any, auth_code: any, stepper: MatStepper) {
    this.authService.logAuthcode(order_id, auth_code).subscribe(result => {
      if (result) {
        stepper.reset();
        this.ngOnInit();
      }
    });
}

  paymentDone($event, stepper: MatStepper) {
    var verifyData;
    this.authService.generateAuthKey(this.ref, this.sKey).subscribe(result => {
      console.log(result);
      verifyData = result;
      if (result) {
        this.pushauthCode(
           this.secondFormGroup.value.id,
           verifyData.data.authorization.authorization_code,
          stepper);
      }
    });
  }
  paymentCancel(stepper: MatStepper) { stepper.reset();
    this.ngOnInit();}

  backHome(){
    this.navCtrl.navigateRoot("/dashboard");
  }
}
