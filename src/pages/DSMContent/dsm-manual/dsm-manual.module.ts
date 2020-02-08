import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DsmManualPage } from './dsm-manual';

@NgModule({
  declarations: [
    DsmManualPage,
  ],
  imports: [
    IonicPageModule.forChild(DsmManualPage),
  ],
})
export class DsmManualPageModule {}
