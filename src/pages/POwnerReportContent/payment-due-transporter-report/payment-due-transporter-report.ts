import { Storage } from '@ionic/storage';
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, App, Platform, LoadingController } from "ionic-angular";
import { Reports } from '../../../app/reports';
import { ReportsProvider } from '../../../providers/reports/reports';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';


/**
 * Generated class for the PaymentDueTransporterReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-payment-due-transporter-report",
  templateUrl: "payment-due-transporter-report.html"
})
export class PaymentDueTransporterReportPage {
  public transporterList = [];
  public transporterNameList: any;
  selectedTransporter: any;
  public treport = new Reports;
  public paymentTransporter: any;
  public payment: any;
  public transporterId: number;
  showEmpty: boolean;
  public transporter: any;
  public query = '';
  public pumpId: number;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public loadingCtrl:LoadingController,
    public appCtrl: App,
    public platform: Platform,
    public reportData: ReportsProvider,
    public basicData: BasicDataProvider) {
    let backAction = this.platform.registerBackButtonAction(() => {
     this.navCtrl.setRoot("CreditSalesReportPage");
      backAction();
    }, 1);
  }

  ionViewDidLoad() {
    this.storage.get('pumpId').then((val) => {
      this.pumpId = val;
              
      this.showTransporter();
      this.showPaymentTransporter();
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
  showTransporter() {
    this.reportData.getTransporterList(this.pumpId)
      .subscribe(res => {
           ;
        this.transporter = res;
        this.transporterNameList = res;
        for (var i = 0; i < res.length; i++) {
          this.transporterList[i] = res[i].name;
        }

      }, err => {
        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      })
  }
  filter() {
    if (this.query !== "") {
      if (this.query.length > 1) {
        this.transporterNameList = this.transporterList.filter(function (el) {
          return el.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
        }.bind(this));
        if (this.transporterNameList.length === 0) {
          this.showEmpty = true;
        }
        else {
          this.showEmpty = false;
        }
      }
    } else {
      this.transporterNameList = [];
    }
  }
  select(item) {
    // this.state = item;
    this.query = '';
    this.selectedTransporter = this.transporter.filter(name => name.name === item);
    this.transporterId = this.selectedTransporter[0].id;
    this.paymentTransporter = this.payment.filter(v => v.transporterId == this.transporterId);
    if (this.paymentTransporter.length == 0) {
      this.basicData.sendErrorNotification("Sorry no transporter");
      this.paymentTransporter = this.payment;
    }
  }
  home() {
   this.navCtrl.setRoot("CreditSalesReportPage")
  }
  showPaymentTransporter() {
    let loading = this.loadingCtrl.create({
        content: 'Please wait...',         enableBackdropDismiss: true,
    });
    loading.present();
    this.reportData.getPaymentDue(this.pumpId)
      .subscribe(res => {
        loading.dismiss();
          console.log(res)
        this.paymentTransporter = res;
        this.payment = res;
      }, err => {

        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
        loading.dismiss();
      });
  }
  menuClick() {
    this.basicData.checkPumpCount();
  }
}
