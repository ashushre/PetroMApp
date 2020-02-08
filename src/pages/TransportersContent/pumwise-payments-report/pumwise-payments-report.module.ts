import { PipesModule } from './../../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PumwisePaymentsReportPage } from './pumwise-payments-report';

@NgModule({
  declarations: [
    PumwisePaymentsReportPage,
  ],
  imports: [
    IonicPageModule.forChild(PumwisePaymentsReportPage),PipesModule
  ],
})
export class PumwisePaymentsReportPageModule {}
