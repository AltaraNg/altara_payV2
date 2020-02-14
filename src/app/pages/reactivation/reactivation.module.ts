import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SharedModule} from '../.././shared.module'
import { IonicModule } from '@ionic/angular';
import { MatStepperModule,MatRadioModule, MatSelectModule,MatOptionModule, MatInputModule, MatButtonModule, MatAutocompleteModule } from '@angular/material';
import { ReactivationPageRoutingModule } from './reactivation-routing.module';
import { Angular4PaystackModule } from 'angular4-paystack';
import { ReactivationPage } from './reactivation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactivationPageRoutingModule,
    SharedModule,
    Angular4PaystackModule,
    MatStepperModule, MatInputModule,MatRadioModule, MatButtonModule, MatAutocompleteModule,ReactiveFormsModule,MatSelectModule,MatOptionModule
  ],
  declarations: [ReactivationPage]
})
export class ReactivationPageModule {}
