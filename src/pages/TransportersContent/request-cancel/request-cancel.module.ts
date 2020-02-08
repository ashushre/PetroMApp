import { PipesModule } from './../../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RequestCancelPage } from './request-cancel';

@NgModule({
  declarations: [
    RequestCancelPage,
  ],
  imports: [
    IonicPageModule.forChild(RequestCancelPage),PipesModule,
  ],
})
export class RequestCancelPageModule {}
