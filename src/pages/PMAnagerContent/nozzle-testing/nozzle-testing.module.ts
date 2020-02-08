import { PipesModule } from './../../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NozzleTestingPage } from './nozzle-testing';

@NgModule({
  declarations: [
    NozzleTestingPage,
  ],
  imports: [
    IonicPageModule.forChild(NozzleTestingPage),PipesModule
  ],
})
export class NozzleTestingPageModule {}
