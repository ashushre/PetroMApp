import { PipesModule } from './../../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NozzleTestingReportPage } from './nozzle-testing-report';

@NgModule({
  declarations: [
    NozzleTestingReportPage,
  ],
  imports: [
    IonicPageModule.forChild(NozzleTestingReportPage),PipesModule
  ],
})
export class NozzleTestingReportPageModule {}
