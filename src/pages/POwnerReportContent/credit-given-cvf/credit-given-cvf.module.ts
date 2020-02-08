import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreditGivenCvfPage } from './credit-given-cvf';
import { PipesModule } from './../../../pipes/pipes.module';
@NgModule({
  declarations: [
    CreditGivenCvfPage,
  ],
  imports: [
    IonicPageModule.forChild(CreditGivenCvfPage),PipesModule,
  ],
})
export class CreditGivenCvfPageModule {}
