import { PipesModule } from './../../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SalesListPage } from './sales-list';
// import { DateTimePipe } from '../../../pipes/date-time/date-time';

@NgModule({
  declarations: [
    SalesListPage,
 // DateTimePipe,
  ],
  imports: [
    IonicPageModule.forChild(SalesListPage),PipesModule
  ],
 // exports: [DateTimePipe,]
})
export class SalesListPageModule { }
