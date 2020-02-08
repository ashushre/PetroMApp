import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';
import { POwnerHomePage } from '../../POwnerContent/p-owner-home/p-owner-home';
import { PManagerHomePage } from '../../PMAnagerContent/p-manager-home/p-manager-home';
import { DsmHomePage } from '../../DSMContent/dsm-home/dsm-home';
import { TransporterPage } from '../../TransportersContent/transporter/transporter';
import { LoginPage } from '../login/login';

/**
 * Generated class for the NoInternetPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-no-internet',
  templateUrl: 'no-internet.html',
})
export class NoInternetPage {
userType:string;
  constructor(public navCtrl: NavController,
    public appCtrl:App,
    public storage:Storage,
    public platform:Platform,
    public network:Network, 
    public navParams: NavParams) {
  this.network.onConnect().subscribe(() => {
    if(this.network.type=="2g")
    {
      this.appCtrl.getRootNav().setRoot("NoInternetPage");
    }
    else
    {
      switch (this.userType) {
        case '11':
         this.navCtrl.setRoot(POwnerHomePage);
          break;
        case '12':
         this.navCtrl.setRoot(PManagerHomePage);
          break;
        case '13':
         this.navCtrl.setRoot(DsmHomePage);
          break;
        case '21':
         this.navCtrl.setRoot(TransporterPage);
          break;
        case '22':
         this.navCtrl.setRoot(TransporterPage);
          break;
      }
    }
      if(this.userType==undefined)
      {
       this.navCtrl.setRoot(LoginPage);
      }
      setTimeout(() => {
        if (this.network.type === 'wifi') {
        }
      }, 3000);
    },err=>{
      console.log(err);
    });
   this.platform.registerBackButtonAction(() => {
     this.navCtrl.setRoot("NoInternetPage");
    });
    this.network.onchange().subscribe(() => {
      switch (this.network.type) {
        case '4g':
        switch (this.userType) {
          case '11':
           this.navCtrl.setRoot(POwnerHomePage);
            break;
          case '12':
           this.navCtrl.setRoot(PManagerHomePage);
            break;
          case '13':
           this.navCtrl.setRoot(DsmHomePage);
            break;
          case '21':
           this.navCtrl.setRoot(TransporterPage);
            break;
          case '22':
           this.navCtrl.setRoot(TransporterPage);
            break;
        }
          break;

      }
    },err=>{
      console.log(err);
    });
  }

  ionViewDidLoad() {
    this.storage.get('userType').then((val) => {
      this.userType = val;
    },err=>{
      console.log(err);
    });
  }
sample()
{
  
}
}
