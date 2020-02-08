import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DefaulterTransportersReportPage } from './defaulter-transporters-report';
import { PipesModule } from './../../../pipes/pipes.module';
@NgModule({
  declarations: [
    DefaulterTransportersReportPage
  ],
  imports: [
    IonicPageModule.forChild(DefaulterTransportersReportPage),PipesModule
  ],
})
export class DefaulterTransportersReportPageModule {}
