
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';
import { Component } from "@angular/core";
import {IonicPage,NavController,NavParams, Platform,App} from "ionic-angular";
import { Storage } from "@ionic/storage";
@IonicPage()
@Component({
  selector: 'page-loyalty-sales-report',
  templateUrl: 'loyalty-sales-report.html',
})
export class LoyaltySalesReportPage {
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
  }

  LoyaltyFuelSoldQtyAmtPage() {
   this.navCtrl.setRoot("LoyaltyFuelSoldQtyAmtPage");
  }

  LoyaltySummaryPage() {
   this.navCtrl.setRoot("LoyaltySummaryPage");
  }

  home() {
   this.navCtrl.setRoot("PumpReportPage");
    
  }
  menuClick() {
    this.basicData.checkPumpCount();
  }
}
