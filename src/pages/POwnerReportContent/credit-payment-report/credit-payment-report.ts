import { Component } from '@angular/core';
import { IonicPage, NavController, App, Platform, LoadingController } from 'ionic-angular';
import { ReportsProvider } from '../../../providers/reports/reports';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';

import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-credit-payment-report',
  templateUrl: 'credit-payment-report.html',
})
export class CreditPaymentReportPage {
  public pumpId: number;
  public transporterId: number;
  public productRate: any;
  public startDate: String;
  public start: Date;
  public endDate: String;
  constructor(public navCtrl: NavController,
    public platform: Platform,
    public appCtrl: App,
    public loadingCtrl:LoadingController,
    public basicData: BasicDataProvider,
    public storage: Storage,
    public reportData: ReportsProvider,
  ) {
    let backAction = this.platform.registerBackButtonAction(() => {
     this.navCtrl.setRoot('PumpReportPage');
      backAction();
    }, 1)
  }

  ionViewDidLoad() {
    //this.basicData.Loader();
    this.storage.get('pumpId').then((val) => {
      this.pumpId = val;
      this.getCreditPayment();
    },err=>{
      console.log(err);
    });
    this.endDate = new Date().toISOString();
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 7);
    this.start = currentDate;
    this.startDate = this.start.toISOString();
  }

  getCreditPayment() {
    let loading = this.loadingCtrl.create({
        content: 'Please wait...',         enableBackdropDismiss: true,
    });

    loading.present();
    this.reportData.getCreditPayment(this.pumpId).subscribe(res => {
      this.productRate = res;
      loading.dismiss();
    }, err => {

      this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      loading.dismiss();
    })
  }
  getCreditPaymentDate() {
    this.reportData.getCreditPaymentDate(this.pumpId, this.startDate, this.endDate).subscribe(res => {
      this.productRate = res;
    }, err => {

      this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
    })
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
