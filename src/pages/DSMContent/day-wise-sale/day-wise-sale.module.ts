import { PipesModule } from './../../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DayWiseSalePage } from './day-wise-sale';

@NgModule({
  declarations: [
    DayWiseSalePage,
  ],
  imports: [
    IonicPageModule.forChild(DayWiseSalePage),PipesModule,
  ],
})
export class DayWiseSalePageModule {}
