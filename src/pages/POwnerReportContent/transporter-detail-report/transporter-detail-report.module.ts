import { PipesModule } from './../../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransporterDetailReportPage } from './transporter-detail-report';

@NgModule({
  declarations: [
    TransporterDetailReportPage,
  ],
  imports: [
    IonicPageModule.forChild(TransporterDetailReportPage),PipesModule
  ],
})
export class TransporterDetailReportPageModule {}
