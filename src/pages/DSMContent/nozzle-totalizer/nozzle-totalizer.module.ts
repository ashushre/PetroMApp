import { PipesModule } from './../../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NozzleTotalizerPage } from './nozzle-totalizer';

@NgModule({
  declarations: [
    NozzleTotalizerPage,
  ],
  imports: [
    IonicPageModule.forChild(NozzleTotalizerPage),PipesModule,
  ],
})
export class NozzleTotalizerPageModule { }
