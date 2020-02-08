import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LostPaymentReportPage } from './lost-payment-report';
import { PipesModule } from './../../../pipes/pipes.module';
@NgModule({
  declarations: [
    LostPaymentReportPage,
  ],
  imports: [
    IonicPageModule.forChild(LostPaymentReportPage),PipesModule
  ],
})
export class LostPaymentReportPageModule { }
