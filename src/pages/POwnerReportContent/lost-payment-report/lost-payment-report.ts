import { Component } from '@angular/core';
import { IonicPage, NavController, App, NavParams, Platform, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';
import { ReportsProvider } from '../../../providers/reports/reports';
import { POwnerHomePage } from '../../POwnerContent/p-owner-home/p-owner-home';
import { PManagerHomePage } from '../../PMAnagerContent/p-manager-home/p-manager-home';
@IonicPage()
@Component({
  selector: 'page-lost-payment-report',
  templateUrl: 'lost-payment-report.html',
})
export class LostPaymentReportPage {
  public pumpId: number;
  public userType: number;
  public currentDate: any;
  public topCustomers: any;
  public errorMsg: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public platform: Platform,
    public appCtrl: App,
    public loadingCtrl:LoadingController,
    public basicData: BasicDataProvider,
    public reportData: ReportsProvider) {
    let backAction = this.platform.registerBackButtonAction(() => {
     this.navCtrl.setRoot('PumpReportPage');
      backAction();
    }, 1)
  }
  ionViewDidLoad() {
    //this.basicData.Loader();
    this.storage.get('pumpId').then((val) => {
      this.pumpId = val;
      this.currentDate = new Date().toISOString();
      this.getLostDriver();
    }, err => {
      this.errorMsg = err;
      this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
    });
    this.storage.get('userType').then((val) => {
      this.userType = val;
    },err=>{
      console.log(err);
    });
  }
  getLostDriver() {
    let loading = this.loadingCtrl.create({
        content: 'Please wait...',         enableBackdropDismiss: true,
    });

    loading.present();
    this.reportData.getLostDriver(this.pumpId, this.currentDate).subscribe(res => {
      this.topCustomers = res;
      loading.dismiss();
    }, err => {
      this.errorMsg = err;
      this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
    })
  }
  dateChanged() {
    this.getLostDriver();
  }

  doRefresh(refresher) {
    this.ionViewDidLoad();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
  home() {
    if (this.userType == 11) {
     this.navCtrl.setRoot(POwnerHomePage)
    }
    else if (this.userType == 12) {
     this.navCtrl.setRoot(PManagerHomePage)
    }
  }
  menuClick() {
    this.basicData.checkPumpCount();
  }
}
