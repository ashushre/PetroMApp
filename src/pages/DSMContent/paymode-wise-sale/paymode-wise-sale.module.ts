import { PipesModule } from './../../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymodeWiseSalePage } from './paymode-wise-sale';

@NgModule({
  declarations: [
    PaymodeWiseSalePage,
  ],
  imports: [
    IonicPageModule.forChild(PaymodeWiseSalePage),PipesModule
  ],
})
export class PaymodeWiseSalePageModule {}
