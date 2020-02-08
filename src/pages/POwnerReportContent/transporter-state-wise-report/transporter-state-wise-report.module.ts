import { PipesModule } from './../../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransporterStateWiseReportPage } from './transporter-state-wise-report';

@NgModule({
  declarations: [
    TransporterStateWiseReportPage,
  ],
  imports: [
    IonicPageModule.forChild(TransporterStateWiseReportPage),PipesModule,
  ],
})
export class TransporterStateWiseReportPageModule {}
