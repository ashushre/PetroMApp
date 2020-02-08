
import { AlertController, LoadingController } from 'ionic-angular';
import { Component } from '@angular/core';
import { IonicPage, App, NavController, NavParams, ToastController, Platform } from 'ionic-angular';
import { Transporter } from '../../../app/transporter';
import { CreditSale } from '../../../app/credit.sale';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';
import { TransDataProvider } from '../../../providers/trans-data/trans-data';
import { Storage } from '@ionic/storage';



@IonicPage()
@Component({
  selector: 'page-request-cancel',
  templateUrl: 'request-cancel.html',
})
export class RequestCancelPage {
  public transRequestList = {};
  public cRequest = new Transporter;
  fuelRequested = new CreditSale;
  creditSales:any;
  cancelRequested: any;
  username: any;
  pending: boolean;
  inProgress: boolean;
  completed: boolean;
  cancelled: boolean;
  hidestatus: boolean;
  pendingStatus: boolean;
  inProgressOnly: boolean;
  fuelBoolean: boolean; fuelrequestnull: boolean; cashrequestnull: boolean;
  fuelActualAmount: number;
  public errorMsg: any;
  id: any;
  reqCount: number;
  toFix: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public basicData: BasicDataProvider,
    public toast: ToastController,
    public storage: Storage,
    public loadingCtrl: LoadingController,
    public appCtrl: App,
    public alertCtrl: AlertController,
    public platform: Platform,
    public transData: TransDataProvider) {
    this.id = navParams.get('param1');
    let backAction = this.platform.registerBackButtonAction(() => {
     this.navCtrl.setRoot('RequestListPage');
      backAction();
    }, 1)
  }

  ionViewDidLoad() {     //this.basicData.Loader();
    this.showRequest();
    this.storage.get('username').then((val) => {
      this.username = val;
    },err=>{
      console.log(err);
    });

  }

  //It shows by Default all details of selected Request
  showRequest() {
    let loading = this.loadingCtrl.create({
        content: 'Please wait...',         enableBackdropDismiss: true,
    });
    loading.present();
    this.storage.get('reqCount').then((val) => {
      this.reqCount = val;
    });


    this.transData.showTransRequests(this.id)
      .subscribe(res => {
        loading.dismiss();
        console.log(res);
        this.creditSales=res;
        this.fuelRequested = res;
        this.fuelRequested.fuelRequested =parseInt(this.creditSales.fuelRequested);
        this.fuelRequested.cashRequested =parseInt(this.creditSales.cashRequested);
        console.log(typeof(this.fuelRequested.fuelRequested))

//Pending
        if (this.fuelRequested.status == 1) {
          this.pending = true;
          this.inProgress = false;
          this.completed = false;
          this.cancelled = false;
          this.fuelBoolean = false;
          this.pendingStatus = true;
        }
//InProgress
        if (this.fuelRequested.status == 2) {
          if (this.fuelRequested.fuelRequested == 0) {
            this.inProgress = true;
            this.pending = false;
            this.completed = false;
            this.pendingStatus = false;
            this.cancelled = false;
            this.fuelBoolean = false;
            this.hidestatus = true;
          } else {
            this.inProgress = true;
            this.fuelBoolean = true;
            this.hidestatus = true;
            this.pending = false;
            this.completed = false;
            this.cancelled = false;
            this.fuelActualAmount = this.fuelRequested.fuelActual * this.fuelRequested.productRate;
            this.toFix = this.fuelActualAmount;
            this.fuelActualAmount = this.toFix.toFixed(0);
          }
        }
//Completed
        if (this.fuelRequested.status == 3) {
          if (this.fuelRequested.cashRequested == 0) {
            this.fuelActualAmount = this.fuelRequested.fuelActual * this.fuelRequested.productRate;
            this.toFix = this.fuelActualAmount;
            this.fuelActualAmount = this.toFix.toFixed(0);
            this.inProgress = true;
            this.pending = false;
            this.completed = false;
            this.fuelrequestnull = true;
            this.cashrequestnull = false;
            this.cancelled = false;
            this.fuelBoolean = true;
            this.inProgressOnly = true;
            this.hidestatus = false;
          }
          if (this.fuelRequested.fuelRequested == 0) {
            this.completed = true;
            this.fuelrequestnull = false;
            this.inProgress = false;
            this.cashrequestnull = true;
            this.cancelled = false;
            this.pending = false;
            this.fuelBoolean = false;
          }
          if (this.fuelRequested.cashRequested != 0 && this.fuelRequested.fuelRequested != 0) {
            this.completed = true;
            this.fuelrequestnull = true;
            this.inProgress = false;
            this.cancelled = false;
            this.cashrequestnull = true;
            this.pending = false;
            this.fuelBoolean = false;
            this.fuelActualAmount = this.fuelRequested.fuelActual * this.fuelRequested.productRate;
            this.toFix = this.fuelActualAmount;
            this.fuelActualAmount = this.toFix.toFixed(0);
          }
        }
//Cancelled
        if (this.fuelRequested.status == 4) {
          this.cancelled = true;
          this.inProgress = false;
          this.completed = false;
          this.pending = false;
          this.fuelBoolean = false;
        }
      }, err => {
        this.errorMsg = err;
        loading.dismiss();
        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      })
  }

  //Cancel the request
  cancelRequest(reqId) {
    this.cRequest.id = reqId;
    let alert = this.alertCtrl.create({
      // title: 'Confirm purchase',
      message: 'Do you really want to Cancel Request?',
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
            this.cRequest.updated_by = this.username;
            console.log(this.cRequest)
            this.transData.cancelTransRequests(this.cRequest, reqId)
              .subscribe(res => {

                console.log(res)
                this.cancelRequested = JSON.stringify(res);
                var error = JSON.parse(this.cancelRequested).error;
                if (error == undefined || error == null) {
                  this.basicData.sendSuccessNotification("Request Cancelled Successfully")
                 this.navCtrl.setRoot('RequestListPage');
                }
                else {
                  this.basicData.sendErrorNotification("" +error);

                }
               this.navCtrl.setRoot('RequestListPage');
              }, err => {

                this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
              })
          }
        }
      ]
    });
    alert.present();

  }

  

  doRefresh(refresher) {
    this.ionViewDidLoad();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
  home() {
    this.navCtrl.setRoot('RequestListPage');
  }
  menuClick() {
    this.basicData.checkTransCount();
  }
}
