import { Component } from '@angular/core';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';
import { IonicPage, App, NavController, NavParams, LoadingController } from 'ionic-angular';
import { TransporterReportPage } from '../../TransportersContent/transporter-report/transporter-report';
import { Reports } from '../../../app/reports';
import { DatePipe } from '@angular/common';
import { Storage } from '@ionic/storage';
import { TransDataProvider } from '../../../providers/trans-data/trans-data';
import { TransporterReportProvider } from '../../../providers/transporter-report/transporter-report';
import { transporterReport } from '../../../app/transporterReport';

/**
 * Generated class for the PumwisePaymentsReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pumwise-payments-report',
  templateUrl: 'pumwise-payments-report.html',
})
export class PumwisePaymentsReportPage {
  transporterId: number;
  productList: any;
  pumpId: number;
  startDate: any;
  productId: number;
  currentDate: any;
  tDate: any;
  eDate: any;
  sDate: any;
  FuelDetail: any[] = [];
  pumpList: any;
  FuelSoldList = new Reports;
  payment = new transporterReport;
  start: Date;
  endDate: any;
  show: boolean = false;
  paymentList: any[] = [];
  view: boolean = false;
  showRecord: boolean = false;
  constructor(public navCtrl: NavController,
    public datePipe: DatePipe,
    public basicData: BasicDataProvider,
    public appCtrl: App,
    public transReport: TransporterReportProvider,
    public transData: TransDataProvider,
    public storage: Storage,
    public loadingCtrl: LoadingController,
    public navParams: NavParams) {
    this.currentDate = new Date().toLocaleDateString();
      
   // this.currentDate = this.datePipe.transform(this.currentDate, "yyyy-MM-dd");
  }

  ionViewDidLoad() {
    this.storage.get("transporterId").then(val => {
      this.transporterId = val;
      this.showPumps();
      this.endDate = new Date().toISOString();
      var currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - 6);
      this.start = currentDate;
      this.startDate = this.start;

    }),err=>{
      console.log(err);
    };
  }

  showPumps() {
    this.transData.getPumpList(this.transporterId)
      .subscribe(res => {
        this.pumpList = res;
        this.pumpId=res[0].pumpId;
           
      this.getPumpwisePayment();

      }, err => {
        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      })
  }

  home() {
   this.navCtrl.setRoot(TransporterReportPage);
  }

  doRefresh(refresher) {
    this.ionViewDidLoad();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  menuClick() {
    this.basicData.checkTransCount();
  }
  onChange(value) {
       
    switch (value) {
      case '1':
        this.startDate = new Date().toISOString();
        this.endDate = new Date().toISOString();
        this.getPumpwisePayment();
        this.show = false;
        break;

      case '2':
        var currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 1);
        this.start = currentDate;
        this.startDate = this.start.toISOString();
        this.endDate = this.startDate;
        this.getPumpwisePayment();
        this.show = false;
        break;
      case '3':
        currentDate = new Date();
        this.endDate = new Date().toISOString();
        currentDate.setDate(currentDate.getDate() - 2);
        this.start = currentDate;
        this.startDate = this.start.toISOString();
        this.getPumpwisePayment();
        this.show = false;
        break;
      case '4':
        currentDate = new Date();
        this.endDate = new Date().toISOString();
        currentDate.setDate(currentDate.getDate() - 6);
        this.start = currentDate;
        this.startDate = this.start.toISOString();
        this.getPumpwisePayment();
        this.show = false;
        break;
      case '5':
        currentDate = new Date();
        this.endDate = new Date().toISOString();
        currentDate.setDate(currentDate.getDate() - 14);
        this.start = currentDate;
        this.startDate = this.start.toISOString();
        this.getPumpwisePayment();
        this.show = false;
        break;
      case '6':
        currentDate = new Date();
        this.endDate = new Date().toISOString();
        currentDate.setDate(1);
        this.start = currentDate;
        this.startDate = this.start.toISOString();
        this.getPumpwisePayment();
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
        this.getPumpwisePayment();
        break;
      case '8':
        this.show = true;
             
        break;
    }
  }
  getPumpwisePayment() {
    let loading = this.loadingCtrl.create({
        content: 'Please wait...',         enableBackdropDismiss: true,
    });

    loading.present();

    this.endDate = this.datePipe.transform(this.endDate, "yyyy-MM-dd");
    this.startDate = this.datePipe.transform(this.startDate, "yyyy-MM-dd");
    this.tDate = this.startDate + ',' + this.endDate;
        
    this.transReport.getPumpWisePaymentReportsDatewise(this.transporterId, this.pumpId, this.tDate).subscribe(res => {
      loading.dismiss();
      this.payment = res;
      this.paymentList = res.sales;
      this.payment.totPending=Math.round(this.payment.totPending);
      this.payment.totPaid=Math.round(this.payment.totPaid);
      this.payment.totDueAmount=Math.round(this.payment.totDueAmount);

      for(var i=0;i<this.paymentList.length;i++)
      {
        this.paymentList[i].dueAmount=  Math.round(this.paymentList[i].dueAmount);
        this.paymentList[i].paid=  Math.round(this.paymentList[i].paid);
        this.paymentList[i].pending=  Math.round(this.paymentList[i].pending);
      }

    },err=>{
      loading.dismiss();
      this.basicData.sendErrorNotification("There is some issue Please Try again Later!!!!")
    })
  }
  selectPump(reqPump) {
    this.pumpId = reqPump;
    this.getPumpwisePayment();
  }
  dateChanged(item) {
    if (this.sDate == undefined || this.eDate == undefined) {
    }
    else {
      this.startDate = this.sDate;
      this.endDate = this.eDate;
      this.getPumpwisePayment();
    }

  }
}
