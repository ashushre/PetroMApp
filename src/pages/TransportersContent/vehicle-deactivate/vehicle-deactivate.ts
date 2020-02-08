import { Storage } from '@ionic/storage';
import { TransporterPage } from './../transporter/transporter';
import { Component } from '@angular/core';
import { IonicPage, NavController, App, NavParams, Platform, AlertController, LoadingController } from 'ionic-angular';
import { Vehicle } from '../../../app/vehicle';
import { TransDataProvider } from '../../../providers/trans-data/trans-data';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';

@IonicPage()
@Component({
  selector: 'page-vehicle-deactivate',
  templateUrl: 'vehicle-deactivate.html',
})
export class VehicleDeactivatePage {
  id: any;
  public activate: Boolean;
  public deactivate: Boolean;
  public view: Boolean;
  vehicleCount: number;
  error1:any;
  public vehicle = new Vehicle;
  public errorMsg: any;
  constructor(public navCtrl: NavController,
    public platform: Platform,
    public appCtrl: App,
    public loadingCtrl:LoadingController,
    public storage: Storage,
    public alertCtrl: AlertController,
    public transData: TransDataProvider,
    public basicData: BasicDataProvider,
    public navParams: NavParams) {
    let backAction = this.platform.registerBackButtonAction(() => {

     this.navCtrl.setRoot('VehicleListPage');
      backAction();
    }, 1)
  }

  ionViewDidLoad() {
    this.id = this.navParams.get('param1');

    this.showVehicle(this.id);
    this.storage.get('vehicleCount').then((val) => {
      this.vehicleCount = val;
    },err=>{
      console.log(err);
    });
  }
  showVehicle(id) {
    let loading = this.loadingCtrl.create({
        content: 'Please wait...',         enableBackdropDismiss: true,
    });
    loading.present();
    this.transData.getVehicle(id)
      .subscribe(response => {
    loading.dismiss();
        var Suc = JSON.stringify(response);
        this.vehicle = JSON.parse(Suc).vehicle;
        this.error1 = JSON.parse(Suc).error;
          if (this.vehicle.active == 0) {
            this.activate = true;
            this.deactivate = false;
          }
          else {
            this.deactivate = true;
            this.activate = false;
          }
          if (this.vehicle.blanket == 1) {
            this.view = true;
          }
       
      }, err => {
        this.errorMsg = err;
        loading.dismiss();
        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      });

  }
  deactVehicle(id) {
    if(this.error1==1)
    {
      this.basicData.sendErrorNotification("There is pending request for this vehicle you cannot deactivate it");
    }
    else
    {
    {
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

              this.transData.getVehicleDeactivate(id)
                .subscribe(res => {
          
                  var Sucess = JSON.stringify(res);
                  var error = JSON.parse(Sucess).error;
                  if (error == undefined || error == null) {
                    this.basicData.sendSuccessNotification("Deactivated Vehicle successfully");
                   this.navCtrl.setRoot('VehicleListPage', {
                      id: 'deact'
                    });
                  }
                  else {
                    this.basicData.sendErrorNotification(""+error);
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
  }
  actVehicle(id) {
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
            this.transData.getVehicleActivate(id)
              .subscribe(res => {
        
                var Sucess = JSON.stringify(res);
                var error = JSON.parse(Sucess).error;
                if (error == undefined || error == null) {
                  this.basicData.sendSuccessNotification("Activated Vehicle successfully");
                 this.navCtrl.setRoot('VehicleListPage');
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
     this.navCtrl.setRoot('VehicleEditPage', {
        id: id
      });
    }
    else
    {
this.basicData.sendErrorNotification("There is pending request for this vehicle you cannot edit it");
    }
   
  }

  doRefresh(refresher) {
    this.ionViewDidLoad();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
  home() {
   this.navCtrl.setRoot('VehicleListPage');
  }
  menuClick() {
    this.basicData.checkTransCount();
  }
}
