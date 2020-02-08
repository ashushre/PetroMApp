import { PipesModule } from './../../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VehicleWiseReportPage } from './vehicle-wise-report';

@NgModule({
  declarations: [
    VehicleWiseReportPage,
  ],
  imports: [
    IonicPageModule.forChild(VehicleWiseReportPage),PipesModule
  ],
})
export class VehicleWiseReportPageModule {}
