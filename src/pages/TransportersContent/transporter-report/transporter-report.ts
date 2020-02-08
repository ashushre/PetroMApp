import { Component } from '@angular/core';
import { IonicPage, App, NavController, NavParams, Platform} from 'ionic-angular';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';
import { TransporterPage } from '../../TransportersContent/transporter/transporter';


@IonicPage()
@Component({
  selector: 'page-transporter-report',
  templateUrl: 'transporter-report.html',
})
export class TransporterReportPage {

  constructor(public navCtrl: NavController, public basicData: BasicDataProvider, public appCtrl: App, public platform: Platform, public navParams: NavParams) {
    let backAction = this.platform.registerBackButtonAction(() => {
     this.navCtrl.setRoot(TransporterPage);
      backAction();
    }, 1)
  }

  ionViewDidLoad() {
    //this.basicData.Loader();
  }

  doRefresh(refresher) {
    this.ionViewDidLoad();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  home() {
   this.navCtrl.setRoot(TransporterPage);
  }

  PumwiseConsumedReportPage() {
   this.navCtrl.setRoot("PumwiseConsumedReportPage");
  }

  PumwisePaymentsReportPage() {
   this.navCtrl.setRoot("PumwisePaymentsReportPage");
  }

  VehicleWiseReportPage() {
   this.navCtrl.setRoot("VehicleWiseReportPage");
  }

  PaymentHistoryPage() {
    this.navCtrl.setRoot("PaymentHistoryPage");
  }

  menuClick() {
    this.basicData.checkPumpCount();
  }

}
