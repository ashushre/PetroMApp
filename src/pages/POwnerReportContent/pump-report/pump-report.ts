
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';
import { Component } from "@angular/core";
import {IonicPage,NavController,NavParams, Platform,App} from "ionic-angular";
import { Storage } from "@ionic/storage";
import { POwnerHomePage } from '../../POwnerContent/p-owner-home/p-owner-home';
import { PManagerHomePage } from '../../PMAnagerContent/p-manager-home/p-manager-home';
@IonicPage()
@Component({
  selector: "page-pump-report",
  templateUrl: "pump-report.html"
})
export class PumpReportPage {
  public userType: number;
  activeCS: number;
  activeLS: number;
  testNav:any;
  activCSShow: boolean;
  activLSShow: boolean;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public platform: Platform,
    public basicData: BasicDataProvider,
    public appCtrl: App
  ) {
    let backAction = this.platform.registerBackButtonAction(() => {
      if (this.userType == 11) {
       this.navCtrl.setRoot(POwnerHomePage);
      } else if (this.userType == 12) {
       this.navCtrl.setRoot(PManagerHomePage);
      }
      backAction();
    }, 1);
  }

  ionViewDidLoad() {
    //this.basicData.Loader();

// console.log(sample);
    this.storage.get("activeCS").then(val => {
      this.activeCS = val;
    },err=>{
      console.log(err);
    });
    this.storage.get("activeLS").then(val => {
      this.activeLS = val;
    },err=>{
      console.log(err);
    });
    this.storage.get("userType").then(val => {
      this.userType = val;
    },err=>{
      console.log(err);
    });
  }

//   topCustomers() {
//     this.testNav = this.appCtrl.getRootNavById('n4');
// this.testNav.setRoot("TopCustomersReportPage"); 
//    //this.navCtrl.setRoot("TopCustomersReportPage");
//   }
  // totalSales() {
  //  this.navCtrl.setRoot("TotalSalesReportPage");
  // }
  // creditPayments() {
  //  this.navCtrl.setRoot("CreditPaymentReportPage");
  // }
  // pendingPayments() {
  //  this.navCtrl.setRoot("PendingPaymentReportPage");
  // }
  // lostPayment() {
  //  this.navCtrl.setRoot("LostPaymentReportPage");
  // }

  // productRateList() {
  //  this.navCtrl.setRoot("ProductRateListReportPage");
  // }

  doRefresh(refresher) {
    this.ionViewDidLoad();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  home() {
    if (this.userType == 11) {
     this.navCtrl.setRoot(POwnerHomePage);
    } else if (this.userType == 12) {
     this.navCtrl.setRoot(PManagerHomePage);
    }
  }

  PumpRelatedReportsPage() {
    // this.testNav = this.appCtrl.getRootNavById('n4');
    // this.testNav.setRoot("PumpRelatedReportsPage"); 
   this.navCtrl.setRoot("PumpRelatedReportsPage");
  }

  CreditSalesReportPage() {
   this.navCtrl.setRoot("CreditSalesReportPage");
  }

  LoyaltySalesReportPage() {
   this.navCtrl.setRoot("LoyaltySalesReportPage");
  }

  menuClick() {
    this.basicData.checkPumpCount();
  }

}
