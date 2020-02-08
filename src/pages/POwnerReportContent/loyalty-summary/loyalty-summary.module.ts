import { PipesModule } from './../../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoyaltySummaryPage } from './loyalty-summary';

@NgModule({
  declarations: [
    LoyaltySummaryPage,
  ],
  imports: [
    IonicPageModule.forChild(LoyaltySummaryPage),PipesModule
  ],
})
export class LoyaltySummaryPageModule {}
