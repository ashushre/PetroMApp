import { PipesModule } from './../../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegularCashPage } from './regular-cash';

@NgModule({
  declarations: [
    RegularCashPage,
  ],
  imports: [
    IonicPageModule.forChild(RegularCashPage),PipesModule
  ],
})
export class RegularCashPageModule {}
