
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';
import { PManagerHomePage } from '../p-manager-home/p-manager-home';
import { ReportsProvider } from '../../../providers/reports/reports';

/**
 * Generated class for the ManagerManualPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manager-manual',
  templateUrl: 'manager-manual.html',
})
export class ManagerManualPage {
  PImage:any[]=[];
  total:number;
  imgLink:any;
  constructor(public navCtrl: NavController,
    public basicData:BasicDataProvider,
    public reportData:ReportsProvider,
     public navParams: NavParams) {
    //this.PImage=['dsm1.png','dsm2.png','dsm3.png','dsm4.png','dsm5.png','dsm6.png','dsm7.png','dsm8.png','dsm9.png','dsm10.png','dsm11.png','dsm12.png','dsm13.png','dsm14.png','dsm15.png','dsm16.png'];
   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DsmManualPage'+this.PImage.length);
  
    this.imgLink = this.basicData.photoURl + "/storage/help/manager";
    this.reportData.getmanagerManual().subscribe(res=>{
      console.log(res);
      this.PImage=res;
      this.total=this.PImage.length-1;
    })
  }

  goToHome()
  {
    this.navCtrl.setRoot(PManagerHomePage);
  }
}