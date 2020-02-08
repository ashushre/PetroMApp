import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExpenseReportPage } from './expense-report';
import { PipesModule } from './../../../pipes/pipes.module';
@NgModule({
  declarations: [
    ExpenseReportPage,
  ],
  imports: [
    IonicPageModule.forChild(ExpenseReportPage),PipesModule,
  ],
})
export class ExpenseReportPageModule {}
