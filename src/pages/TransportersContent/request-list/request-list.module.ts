import { PipesModule } from './../../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RequestListPage } from './request-list';

@NgModule({
  declarations: [
    RequestListPage,
  ],
  imports: [
    IonicPageModule.forChild(RequestListPage),PipesModule,
  ],
})
export class RequestListPageModule {}
