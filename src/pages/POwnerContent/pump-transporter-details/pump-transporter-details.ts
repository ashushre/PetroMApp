import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, App, LoadingController } from 'ionic-angular';
import { TransDataProvider } from '../../../providers/trans-data/trans-data';
import { Transporter } from '../../../app/transporter';
import { PumpDataProvider } from '../../../providers/pump-data/pump-data';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';

/**
 * Generated class for the PumpTransporterDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pump-transporter-details',
  templateUrl: 'pump-transporter-details.html',
})
export class PumpTransporterDetailsPage {
  public transporterId: any;
  transDetail = new Transporter();
  pumpId: number;
  transCount: number;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public transData: TransDataProvider,
    public alertCtrl: AlertController,
    public basicData: BasicDataProvider,
    public loadingCtrl:LoadingController,
    public appCtrl: App,
    public pumpData: PumpDataProvider,
    public storage: Storage) {
    this.transporterId = this.navParams.get('param');
  }

  ionViewDidLoad() {
    this.storage.get('pumpId').then((val) => {
      this.pumpId = val;
      this.showPumpList();
    },err=>{
      console.log(err);
    });
  }
  deactTransporter(id) {
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
            this.pumpData.changeTranspStatus(this.pumpId, id).subscribe(res => {
              this.basicData.sendSuccessNotification("Transporter Deactivated Successfully");
             this.navCtrl.setRoot('PumpTransportersListPage', {
                id: 'deact'
              });
            }, err => {
              this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
            })
          }
        }
      ]
    });
    alert.present();

  }
  actTransporter(id) {
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
            this.pumpData.changeTranspStatus(this.pumpId, id).subscribe(res => {
              this.basicData.sendSuccessNotification("Transporter Activated Successfully");
             this.navCtrl.setRoot('PumpTransportersListPage');
            }, err => {
              this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
            })

          }
        }
      ]
    });
    alert.present();

  }
  defaultTransporter(id) {
    let alert = this.alertCtrl.create({
      message: 'Do you really want to mark as Defaulter?',
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
            this.pumpData.changeTranspDefaulterStatus(this.pumpId, id).subscribe(res => {
              this.basicData.sendSuccessNotification("Transporter marked as defaulter Successfully");
             this.navCtrl.setRoot('PumpTransportersListPage', {
                id: 'default'
              });
            }, err => {
              this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
            })
          }
        }
      ]
    });
    alert.present();

  }
  removeTransporter(id) {
    let alert = this.alertCtrl.create({
      message: 'Do you really want to remove Defaulter?',
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
            this.pumpData.changeTranspDefaulterStatus(this.pumpId, id).subscribe(res => {
              this.basicData.sendSuccessNotification("Transporter removed from defaulter Successfully");
             this.navCtrl.setRoot('PumpTransportersListPage');
            }, err => {
              this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
            })
          }
        }
      ]
    });
    alert.present();

  }
  showPumpList() {
    let loading = this.loadingCtrl.create({
        content: 'Please wait...',         enableBackdropDismiss: true,
    });
    loading.present();
    this.transData.getPumpTransporter(this.pumpId, this.transporterId).subscribe(res => {
      loading.dismiss();
      this.transDetail = res;
    }, err => {

      this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      loading.dismiss();
    })
  }
  home() {
   this.navCtrl.setRoot('PumpTransportersListPage');
  }

  doRefresh(refresher) {
    this.ionViewDidLoad();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
  menuClick() {
    this.basicData.checkPumpCount();
  }
}
