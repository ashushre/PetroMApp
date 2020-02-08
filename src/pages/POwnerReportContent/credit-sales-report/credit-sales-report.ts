
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Platform, App } from "ionic-angular";
import { Storage } from "@ionic/storage";
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';

@IonicPage()
@Component({
  selector: "page-credit-sales-report",
  templateUrl: "credit-sales-report.html"
})
export class CreditSalesReportPage {

  public userType: number;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public platform: Platform,
    public basicData: BasicDataProvider,
    public appCtrl: App) {
    let backAction = this.platform.registerBackButtonAction(() => {
     this.navCtrl.setRoot("PumpReportPage");
      backAction();
    }, 1);
  }

  ionViewDidLoad() {
    this.storage.get("userType").then(val => {
      this.userType = val;
    },err=>{
      console.log(err);
    });
  }

  doRefresh(refresher) {
    this.ionViewDidLoad();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
  home() {
   this.navCtrl.setRoot("PumpReportPage");
  }

  TransporterDetailPage() {
   this.navCtrl.setRoot("TransporterDetailReportPage");
  }

  TransporterStateWisePage() {
   this.navCtrl.setRoot("TransporterStateWiseReportPage");
  }

  DefaulterTransporterPage() {
   this.navCtrl.setRoot("DefaulterTransportersReportPage");
  }

  PaymentDueTransporterReportPage() {
   this.navCtrl.setRoot("PaymentDueTransporterReportPage");
  }

  PaymentReceivedPaymodeWiseReportPage() {
   this.navCtrl.setRoot("PaymentReceivedPaymodeWiseReportPage");
  }

  PaymentReceivedTransporterWiseReportPage() {
    this.appCtrl
      .getRootNav()
      .setRoot("PaymentReceivedTransporterWiseReportPage");
  }

  PaymentDueCvfReportPage() {
   this.navCtrl.setRoot("PaymentDueCvfReportPage");
  }

  CreditGivenCvfPage() {
   this.navCtrl.setRoot("CreditGivenCvfPage");
  }
  menuClick() {
    this.basicData.checkPumpCount();
  }

}
