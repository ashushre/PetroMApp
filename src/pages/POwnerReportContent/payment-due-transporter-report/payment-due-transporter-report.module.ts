import { PipesModule } from './../../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentDueTransporterReportPage } from './payment-due-transporter-report';

@NgModule({
  declarations: [
    PaymentDueTransporterReportPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentDueTransporterReportPage),PipesModule
  ],
})
export class PaymentDueTransporterReportPageModule {}
