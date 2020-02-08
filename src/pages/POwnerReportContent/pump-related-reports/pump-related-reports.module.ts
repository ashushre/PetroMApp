import { PipesModule } from './../../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PumpRelatedReportsPage } from './pump-related-reports';

@NgModule({
  declarations: [
    PumpRelatedReportsPage,
  ],
  imports: [
    IonicPageModule.forChild(PumpRelatedReportsPage),PipesModule,
  ],
})
export class PumpRelatedReportsPageModule {}
