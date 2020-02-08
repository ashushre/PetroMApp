import { PipesModule } from './../../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentReceivedPaymodeWiseReportPage } from './payment-received-paymode-wise-report';

@NgModule({
  declarations: [
    PaymentReceivedPaymodeWiseReportPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentReceivedPaymodeWiseReportPage),PipesModule,
  ],
})
export class PaymentReceivedPaymodeWiseReportPageModule {}
