import { Component } from '@angular/core';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';
import { IonicPage, App, NavController, NavParams, LoadingController } from 'ionic-angular';
import { TransporterReportPage } from '../../TransportersContent/transporter-report/transporter-report';
import { DatePipe } from '@angular/common';
import { Storage } from '@ionic/storage';
import { TransDataProvider } from '../../../providers/trans-data/trans-data';
import { TransporterReportProvider } from '../../../providers/transporter-report/transporter-report';
import { transporterReport } from '../../../app/transporterReport';

/**
 * Generated class for the PumwiseConsumedReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pumwise-consumed-report',
  templateUrl: 'pumwise-consumed-report.html',
})
export class PumwiseConsumedReportPage {
  transporterId: number;
  productList: any;
  pumpId: number;
  startDate: any;
  productId: number;
  currentDate: any;
  tDate: any;
  eDate: any;
  sDate: any;
  consumedList: any[] = [];
  pumpList: any;
  consumed = new transporterReport;
  payment = new transporterReport;
  start: Date;
  endDate: any;
  creditLimit:any;
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
   
    });
  }

  showPumps() {
    this.transData.getPumpList(this.transporterId)
      .subscribe(res => {
        this.pumpList = res;
        console.log(res);
        //this.pumpId=res[0].pumpId;
        this.pumpId=0;
      this.getPumpwiseConsumed();

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
        this.getPumpwiseConsumed();
        this.show = false;
        break;

      case '2':
        var currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 1);
        this.start = currentDate;
        this.startDate = this.start.toISOString();
        this.endDate = this.startDate;
        this.getPumpwiseConsumed();
        this.show = false;
        break;
      case '3':
        currentDate = new Date();
        this.endDate = new Date().toISOString();
        currentDate.setDate(currentDate.getDate() - 2);
        this.start = currentDate;
        this.startDate = this.start.toISOString();
        this.getPumpwiseConsumed();
        this.show = false;
        break;
      case '4':
        currentDate = new Date();
        this.endDate = new Date().toISOString();
        currentDate.setDate(currentDate.getDate() - 6);
        this.start = currentDate;
        this.startDate = this.start.toISOString();
        this.getPumpwiseConsumed();
        this.show = false;
        break;
      case '5':
        currentDate = new Date();
        this.endDate = new Date().toISOString();
        currentDate.setDate(currentDate.getDate() - 14);
        this.start = currentDate;
        this.startDate = this.start.toISOString();
        this.getPumpwiseConsumed();
        this.show = false;
        break;
      case '6':
        currentDate = new Date();
        this.endDate = new Date().toISOString();
        currentDate.setDate(1);
        this.start = currentDate;
        this.startDate = this.start.toISOString();
        this.getPumpwiseConsumed();
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
        this.getPumpwiseConsumed();
        break;
      case '8':
        this.show = true;
             
        break;
    }
  }
  getPumpwiseConsumed() {
    let loading = this.loadingCtrl.create({
        content: 'Please wait...',         enableBackdropDismiss: true,
    });
    loading.present();
    this.endDate = this.datePipe.transform(this.endDate, "yyyy-MM-dd");
    this.startDate = this.datePipe.transform(this.startDate, "yyyy-MM-dd");
    this.tDate = this.startDate + ',' + this.endDate;
        
    this.transReport.getPumpwiseConsumedDatewise(this.transporterId, this.pumpId,this.tDate).subscribe(res => {
      loading.dismiss();
      this.consumed = res;
      this.consumedList = res.sales;
    },err => {
      loading.dismiss();
      this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
    })
  }
  selectPump(reqPump) {
    this.pumpId = reqPump;
    this.getPumpwiseConsumed();
  }
  dateChanged(item) {
    if (this.sDate == undefined || this.eDate == undefined) {
    }
    else {
      this.startDate = this.sDate;
      this.endDate = this.eDate;
      this.getPumpwiseConsumed();
    }

  }


}
