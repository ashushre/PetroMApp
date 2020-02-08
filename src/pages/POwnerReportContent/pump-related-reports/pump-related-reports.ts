import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Platform, App } from "ionic-angular";

import { BasicDataProvider } from '../../../providers/basic-data/basic-data';
import { Storage } from "@ionic/storage";
@IonicPage()
@Component({
  selector: 'page-pump-related-reports',
  templateUrl: 'pump-related-reports.html',
})
export class PumpRelatedReportsPage {
  testNav: any;
  public userType: number;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public platform: Platform,
    public basicData: BasicDataProvider,
    public appCtrl: App
  ) {
    let backAction = this.platform.registerBackButtonAction(() => {
      this.navCtrl.setRoot("PumpReportPage");
      backAction();
    }, 1);
  }

  ionViewDidLoad() {
    this.storage.get("userType").then(val => {
      this.userType = val;
    }, err => {
      console.log(err);
    });
  }

  AllFuelSoldPage() {
    this.navCtrl.setRoot("AllFuelSoldPage")
  }

  home() {
    this.navCtrl.setRoot("PumpReportPage")

  }

  OilPurchasePage() {
    this.navCtrl.setRoot("OilPurchasePage")
  }

  PaymentReceivedPaymodeWiseReportPage() {
    this.navCtrl.setRoot("PaymentReceivedPaymodeWiseReportPage");
  }

  NozzleTestingReportPage() {
    this.navCtrl.setRoot("NozzleTestingReportPage");
  }

  DsrReportPage() {
    this.navCtrl.setRoot("DsrReportPage");
  }

  ExpenseReportPage() {
    this.navCtrl.setRoot("ExpenseReportPage");
  }

  menuClick() {
    this.basicData.checkPumpCount();
  }

}
