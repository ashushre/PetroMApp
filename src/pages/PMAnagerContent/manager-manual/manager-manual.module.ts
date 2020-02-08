import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManagerManualPage } from './manager-manual';

@NgModule({
  declarations: [
    ManagerManualPage,
  ],
  imports: [
    IonicPageModule.forChild(ManagerManualPage),
  ],
})
export class ManagerManualPageModule {}
