import { PipesModule } from './../../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SingleSalesPage } from './single-sales';

@NgModule({
  declarations: [
    SingleSalesPage,
  ],
  imports: [
    IonicPageModule.forChild(SingleSalesPage),PipesModule
  ],
})
export class SingleSalesPageModule {}
