import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RequestRaisePage } from './request-raise';
import { PipesModule } from './../../../pipes/pipes.module';
@NgModule({
  declarations: [
    RequestRaisePage,
  ],
  imports: [
    IonicPageModule.forChild(RequestRaisePage),PipesModule
  ],
})
export class RequestRaisePageModule {}
