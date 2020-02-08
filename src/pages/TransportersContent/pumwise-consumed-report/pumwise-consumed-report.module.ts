import { PipesModule } from './../../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PumwiseConsumedReportPage } from './pumwise-consumed-report';

@NgModule({
  declarations: [
    PumwiseConsumedReportPage,
  ],
  imports: [
    IonicPageModule.forChild(PumwiseConsumedReportPage),PipesModule
  ],
})
export class PumwiseConsumedReportPageModule {}
