import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreditPaymentReportPage } from './credit-payment-report';
import { PipesModule } from './../../../pipes/pipes.module';
@NgModule({
  declarations: [
    CreditPaymentReportPage,

  ],
  imports: [
    IonicPageModule.forChild(CreditPaymentReportPage),PipesModule,
  ],
})
export class CreditPaymentReportPageModule { }
