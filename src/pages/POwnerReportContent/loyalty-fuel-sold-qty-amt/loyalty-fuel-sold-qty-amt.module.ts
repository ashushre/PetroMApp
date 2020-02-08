import { PipesModule } from './../../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoyaltyFuelSoldQtyAmtPage } from './loyalty-fuel-sold-qty-amt';

@NgModule({
  declarations: [
    LoyaltyFuelSoldQtyAmtPage,
  ],
  imports: [
    IonicPageModule.forChild(LoyaltyFuelSoldQtyAmtPage),PipesModule
  ],
})
export class LoyaltyFuelSoldQtyAmtPageModule {}
