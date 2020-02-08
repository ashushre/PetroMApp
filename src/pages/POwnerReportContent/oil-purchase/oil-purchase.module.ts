import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OilPurchasePage } from './oil-purchase';
import { PipesModule } from './../../../pipes/pipes.module';
@NgModule({
  declarations: [
    OilPurchasePage,
  ],
  imports: [
    IonicPageModule.forChild(OilPurchasePage),PipesModule,
  ],
})
export class OilPurchasePageModule {}
