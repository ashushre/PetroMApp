import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController, App, LoadingController } from 'ionic-angular';
import { TDriver } from '../../../app/tdriver';
import { TransDataProvider } from '../../../providers/trans-data/trans-data';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';
/**
 * Generated class for the TdriverDeactivatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tdriver-deactivate',
  templateUrl: 'tdriver-deactivate.html',
})
export class TdriverDeactivatePage {
  id: any;
  error1:any;
  public activate: Boolean;
  public deactivate: Boolean;
  driverCount: number;
  public tdriver = new TDriver;
  public errorMsg: any
  constructor(public navCtrl: NavController,
    public platform: Platform,
    public appCtrl: App,
    public loadingCtrl:LoadingController,
    public alertCtrl: AlertController,
    public storage: Storage,
    public transData: TransDataProvider,
    public basicData: BasicDataProvider,
    public navParams: NavParams) {
    let backAction = this.platform.registerBackButtonAction(() => {
     this.navCtrl.setRoot('TDriverListPage');
      backAction();
    }, 1)
  }

  ionViewDidLoad() {
    //this.basicData.Loader();
    this.id = this.navParams.get('param1');
    this.storage.get('driverCount').then((val) => {
      this.driverCount = val;
    },err=>{
      console.log(err);
    });
    let loading = this.loadingCtrl.create({
        content: 'Please wait...',         enableBackdropDismiss: true,
    });
    loading.present();
    this.transData.getTDriver(this.id).subscribe(res => {
      this.tdriver = res;
      loading.dismiss();
      var Suc = JSON.stringify(res);
  this.error1 = JSON.parse(Suc).error;
  this.tdriver= JSON.parse(Suc).tdriver;
      if (this.tdriver.active == 0) {
        this.activate = true;
        this.deactivate = false;
      }
      else {
        this.deactivate = true;
        this.activate = false;
      }
    }, err => {
      this.errorMsg = err;
      loading.dismiss();
      this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
    });
  }
  deactDriver(id) {
    if(this.error1==1)
    {
      this.basicData.sendErrorNotification("There is pending request for this driver you cannot deactivate it");
    }
    else
    {
    let alert = this.alertCtrl.create({
      message: 'Do you really want to Deactivate?',
        enableBackdropDismiss: true,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.transData.getTDriverDeactivate(this.id)
              .subscribe(res => {
                var Sucess = JSON.stringify(res);
                var error = JSON.parse(Sucess).error;
                  if (error == undefined || error == null) {
                    this.basicData.sendSuccessNotification("Driver Deactivated Successfully");
                   this.navCtrl.setRoot('TDriverListPage', {
                      id: 'deact'
                    });
                  }
                  else {
                 this.basicData.sendErrorNotification(error);
                  }
              }, err => {
                this.errorMsg = err;
                this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
              })
          }
        }
      ]
    });
  
    alert.present();
  }
  }
  actDriver(id) {
    let alert = this.alertCtrl.create({
      // title: 'Confirm purchase',
      message: 'Do you really want to Activate?',
        enableBackdropDismiss: true,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.transData.getTDriverActivate(this.id)
              .subscribe(res => {
              var Sucess = JSON.stringify(res);
              var error = JSON.parse(Sucess).error;
                if (error == undefined || error == null) {
                  this.basicData.sendSuccessNotification("Driver Activated Successfully");
                 this.navCtrl.setRoot('TDriverListPage');
                }
                else {
               this.basicData.sendErrorNotification(error);
                }
            }, err => {
              this.errorMsg = err;
              this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
            })
          }
        }
      ]
    });
    alert.present();

  }
  editPage(id) {
    if (this.error1==0) {
     this.navCtrl.setRoot('TdriverEditPage', {
        param1: id
      });
    }
    else
    {
this.basicData.sendErrorNotification("There is pending request for this driver you cannot edit it");
    }
    
  }
  
  doRefresh(refresher) {
    this.ionViewDidLoad();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
  menuClick() {
    this.basicData.checkTransCount();
  }
  home(){
   this.navCtrl.setRoot('TDriverListPage');
  }
}
