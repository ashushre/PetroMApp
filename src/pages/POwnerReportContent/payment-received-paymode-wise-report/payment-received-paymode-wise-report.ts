import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Platform, LoadingController } from 'ionic-angular';
import { Reports } from '../../../app/reports';
import { ReportsProvider } from '../../../providers/reports/reports';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';
import { DatePipe } from '@angular/common';
import { SalesDataProvider } from '../../../providers/sales-data/sales-data';


/**
 * Generated class for the PaymentReceivedPaymodeWiseReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment-received-paymode-wise-report',
  templateUrl: 'payment-received-paymode-wise-report.html',
})
export class PaymentReceivedPaymodeWiseReportPage {
  startDate: any;
  start: Date;
  endDate: any;
  paymodeList: any;
  currentDate: any;
  PaymodeId: any;
  tDate: any;
  eDate: any;
  sDate: any;
  pumpId: number;
  activeCS:number;
  activeLS:number;
  paymentR = new Reports;
  public ValidDateofBirth: any;
  show: boolean = false;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private datePipe: DatePipe,
    public appCtrl: App,
    public loadingCtrl:LoadingController,
    public storage: Storage,
    public reportData: ReportsProvider,
    public platform: Platform,
    public salesData: SalesDataProvider,
    public basicData: BasicDataProvider) {
    this.PaymodeId = 0;
    let backAction = this.platform.registerBackButtonAction(() => {
     this.navCtrl.setRoot("PumpRelatedReportsPage");
      backAction();
    }, 1);
    this.currentDate = new Date().toLocaleDateString();;
      
    //this.currentDate = this.datePipe.transform(this.currentDate, "yyyy-MM-dd");
  }

  ionViewDidLoad() {
    this.showPaymode();
    this.endDate = new Date().toISOString();
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 6);
    this.start = currentDate;
    this.startDate = this.start;
 
    this.storage.get('pumpId').then((val) => {
      this.pumpId = val;
              ;
      this.getPayment();
    },err=>{
      console.log(err);
    });
    this.storage.get('activeCS').then((val) => {
      this.activeCS = val;
    },err=>{
      console.log(err);
    });

    this.storage.get('activeLS').then((val) => {
      this.activeLS = val;
    },err=>{
      console.log(err);
    });


  }
  showPaymode() {
    this.salesData.getPayMode()
      .subscribe(res => {
        this.paymodeList = res;
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
  onChange(value) {
       
    switch (value) {
      case '1':
        this.startDate = new Date().toISOString();
        this.endDate = new Date().toISOString();
        this.getPayment();
        this.show = false;
        break;

      case '2':
        var currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 1);
        this.start = currentDate;
        this.startDate = this.start.toISOString();
        this.endDate = this.startDate;
        this.getPayment();
        this.show = false;
        break;
      case '3':
        currentDate = new Date();
        this.endDate = new Date().toISOString();
        currentDate.setDate(currentDate.getDate() - 2);
        this.start = currentDate;
        this.startDate = this.start.toISOString();
        this.getPayment();
        this.show = false;
        break;
      case '4':
        currentDate = new Date();
        this.endDate = new Date().toISOString();
        currentDate.setDate(currentDate.getDate() - 6);
        this.start = currentDate;
        this.startDate = this.start.toISOString();
        this.getPayment();
        this.show = false;
        break;
      case '5':
        currentDate = new Date();
        this.endDate = new Date().toISOString();
        currentDate.setDate(currentDate.getDate() - 14);
        this.start = currentDate;
        this.startDate = this.start.toISOString();
        this.getPayment();
        this.show = false;
        break;
      case '6':
        currentDate = new Date();
        this.endDate = new Date().toISOString();
        currentDate.setDate(1);
        this.start = currentDate;
        this.startDate = this.start.toISOString();
        this.getPayment();
        this.show = false;
        break;
      case '7':
        currentDate = new Date();

        currentDate.setDate(1);
        var currentMonth = currentDate.getMonth() - 1;
        currentDate.setMonth(currentMonth);
        this.start = currentDate;
        this.startDate = this.start.toISOString();
        // var currentDate = new Date();
        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        var lastDay = new Date(y, m, 0);
        this.start = lastDay;
        this.endDate = this.start.toISOString();
        this.getPayment();
        break;
      case '8':
        this.show = true;
             
        break;
    }
  }
  selectPaymodeList(reqFuel1) {
    this.PaymodeId = reqFuel1;
    this.getPayment();
  }
  getPayment() {
    let loading = this.loadingCtrl.create({
        content: 'Please wait...',         enableBackdropDismiss: true,
    });
    loading.present();
    this.endDate = this.datePipe.transform(this.endDate, "yyyy-MM-dd");
    this.startDate = this.datePipe.transform(this.startDate, "yyyy-MM-dd");
    this.tDate = this.startDate + ',' + this.endDate;
        
    this.reportData.getPaymentReceivedPaymodeWise(this.pumpId, this.PaymodeId, this.tDate).subscribe(res => {
         
      loading.dismiss();
      this.paymentR = res;
      if (this.paymentR.creditSales == null) {
        this.paymentR.creditSales = 0;
      }
      if (this.paymentR.loyaltySales == null) {
        this.paymentR.loyaltySales = 0;
      }
      if (this.paymentR.regularSales == null) {
        this.paymentR.regularSales = 0;
      }
      if (this.paymentR.otherSales == null) {
        this.paymentR.otherSales = 0;
      }
    }, err => {

      this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      loading.dismiss();
    })
  }
  dateChanged() {
          
    this.startDate = this.sDate;
    this.endDate = this.eDate;
    this.getPayment();
  }
  home() {
   this.navCtrl.setRoot("PumpRelatedReportsPage")
  }
  menuClick() {
    this.basicData.checkPumpCount();
  }

}
