
import { Component } from '@angular/core';
import { IonicPage, App, NavController, NavParams, Platform, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ReportsProvider } from '../../../providers/reports/reports';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';
import { POwnerHomePage } from '../../POwnerContent/p-owner-home/p-owner-home';
import { PManagerHomePage } from '../../PMAnagerContent/p-manager-home/p-manager-home';

/**
 * Generated class for the ProductRateListReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-product-rate-list-report',
  templateUrl: 'product-rate-list-report.html',
})
export class ProductRateListReportPage {
  public pumpId: any;
  public productRate: any;
  public userType: number;
  public errorMsg: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl:LoadingController,
    public storage: Storage,
    public appCtrl: App,
    public platform: Platform,
    public basicData: BasicDataProvider,
    public reportData: ReportsProvider
  ) {
    let backAction = this.platform.registerBackButtonAction(() => {
     this.navCtrl.setRoot('PumpReportPage');
      backAction();
    }, 1)
  }

  ionViewDidLoad() {     //this.basicData.Loader();
    this.storage.get('pumpId').then((val) => {
      this.pumpId = val;
      this.getProductRate();
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
  getProductRate() {
    let loading = this.loadingCtrl.create({
        content: 'Please wait...',         enableBackdropDismiss: true,
    });
    loading.present();
    this.reportData.getProductRatesList(this.pumpId).subscribe(res => {
      this.productRate = res;
      loading.dismiss();
    }, err => {
      this.errorMsg = err;
      loading.dismiss();
      this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
    })
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
