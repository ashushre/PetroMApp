import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DsrReportPage } from './dsr-report';
import { PipesModule } from './../../../pipes/pipes.module';
@NgModule({
  declarations: [
    DsrReportPage,
  ],
  imports: [
    IonicPageModule.forChild(DsrReportPage),PipesModule,
  ],
})
export class DsrReportPageModule {}
