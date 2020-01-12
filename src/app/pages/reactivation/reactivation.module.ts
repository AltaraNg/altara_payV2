import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReactivationPageRoutingModule } from './reactivation-routing.module';

import { ReactivationPage } from './reactivation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactivationPageRoutingModule
  ],
  declarations: [ReactivationPage]
})
export class ReactivationPageModule {}
