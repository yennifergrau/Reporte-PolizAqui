import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportAliadoPageRoutingModule } from './report-aliado-routing.module';

import { ReportAliadoPage } from './report-aliado.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportAliadoPageRoutingModule
  ],
  declarations: [ReportAliadoPage]
})
export class ReportAliadoPageModule {}
