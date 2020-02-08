import { PipesModule } from './../../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductRateListReportPage } from './product-rate-list-report';

@NgModule({
  declarations: [
    ProductRateListReportPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductRateListReportPage),PipesModule,
  ],
})
export class ProductRateListReportPageModule {}
