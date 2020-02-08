import { PipesModule } from './../../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreditSalePage } from './credit-sale';

@NgModule({
  declarations: [
    CreditSalePage,
  ],
  imports: [
    IonicPageModule.forChild(CreditSalePage),PipesModule
  ],
})
export class CreditSalePageModule { }
