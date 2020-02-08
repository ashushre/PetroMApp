import { PipesModule } from './../../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AllFuelSoldPage } from './all-fuel-sold';

@NgModule({
  declarations: [
    AllFuelSoldPage,

  ],
  imports: [
    IonicPageModule.forChild(AllFuelSoldPage),PipesModule,
  ],
})
export class AllFuelSoldPageModule {}
