import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReactivationPage } from './reactivation.page';

const routes: Routes = [
  {
    path: '',
    component: ReactivationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReactivationPageRoutingModule {}
