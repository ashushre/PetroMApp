import { PipesModule } from './../../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VehicleDeactivatePage } from './vehicle-deactivate';

@NgModule({
  declarations: [
    VehicleDeactivatePage,
  ],
  imports: [
    IonicPageModule.forChild(VehicleDeactivatePage),PipesModule
  ],
})
export class VehicleDeactivatePageModule {}
