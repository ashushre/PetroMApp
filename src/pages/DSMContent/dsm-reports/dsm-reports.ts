import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { DsmHomePage } from '../dsm-home/dsm-home';

/**
 * Generated class for the DsmReportsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dsm-reports',
  templateUrl: 'dsm-reports.html',
})
export class DsmReportsPage {

  constructor(public navCtrl: NavController,
    public appCtrl:App, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }
  DayWiseSale()
  {
   this.navCtrl.setRoot("DayWiseSalePage");
  }
  PaymodewiseSale()
  {
   this.navCtrl.setRoot("PaymodeWiseSalePage");
  }
  home()
  {
   this.navCtrl.setRoot(DsmHomePage);
  }
}
