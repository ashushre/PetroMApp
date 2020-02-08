import { PipesModule } from './../../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentDueCvfReportPage } from './payment-due-cvf-report';

@NgModule({
  declarations: [
    PaymentDueCvfReportPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentDueCvfReportPage),PipesModule
  ],
})
export class PaymentDueCvfReportPageModule {}
