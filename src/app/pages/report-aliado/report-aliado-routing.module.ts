import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportAliadoPage } from './report-aliado.page';

const routes: Routes = [
  {
    path: '',
    component: ReportAliadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportAliadoPageRoutingModule {}
