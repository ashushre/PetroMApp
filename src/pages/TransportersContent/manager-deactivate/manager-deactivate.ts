import { Storage } from '@ionic/storage';
import { TransporterPage } from './../transporter/transporter';
import { Component } from '@angular/core';
import { IonicPage, App, NavController, NavParams, Platform, AlertController, LoadingController } from 'ionic-angular';
import { Manager } from '../../../app/manager';
import { TransDataProvider } from '../../../providers/trans-data/trans-data';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';



@IonicPage()
@Component({
  selector: 'page-manager-deactivate',
  templateUrl: 'manager-deactivate.html',
})
export class ManagerDeactivatePage {
  id: any;
  public manager = new Manager;
  mgrCount: number;
  public activate: Boolean;
  public deactivate: Boolean;
  public errorMsg: any;
  constructor(public navCtrl: NavController,
    public transData: TransDataProvider,
    public platform: Platform,
    public storage: Storage,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public appCtrl: App,
    public basicData: BasicDataProvider,
    public navParams: NavParams) {
    let backAction = this.platform.registerBackButtonAction(() => {
     this.navCtrl.setRoot('ManagerListPage');
      backAction();
    }, 1)
  }

  ionViewDidLoad() {
    //this.basicData.Loader();
    let loading = this.loadingCtrl.create({
        content: 'Please wait...',         enableBackdropDismiss: true,
    });
    loading.present();
    this.id = this.navParams.get('param1');
    this.transData.getManager(this.id)
      .subscribe(res => {
        this.manager = res;
        loading.dismiss();
        ;
        if (this.manager.active == 0) {
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

  deactManager(id) {
    let alert = this.alertCtrl.create({
      // title: 'Confirm purchase',
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
            this.transData.getManagerDeactivate(this.id)
              .subscribe(res => {
                this.basicData.sendSuccessNotification("Manager Deactivated Successfully");
               this.navCtrl.setRoot('ManagerListPage', {
                  param1: 'deac'
                });
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

  actManager(id) {
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
            this.transData.getManagerActivate(this.id)
              .subscribe(res => {
                this.basicData.sendSuccessNotification("Manager Activated Successfully");
               this.navCtrl.setRoot('ManagerListPage')
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
   this.navCtrl.setRoot('ManagerEditPage', {
      param1: id
    });
  }

  home() {
   this.navCtrl.setRoot(TransporterPage);
  }
  
  menuClick() {
    this.basicData.checkTransCount();
  }
}
