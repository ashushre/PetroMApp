import { PipesModule } from './../../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentReceivedTransporterWiseReportPage } from './payment-received-transporter-wise-report';

@NgModule({
  declarations: [
    PaymentReceivedTransporterWiseReportPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentReceivedTransporterWiseReportPage),PipesModule,
  ],
})
export class PaymentReceivedTransporterWiseReportPageModule {}
