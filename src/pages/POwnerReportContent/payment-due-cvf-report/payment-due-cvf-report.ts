import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Platform, LoadingController } from 'ionic-angular';
import { DatePipe } from '@angular/common';
import { Reports } from '../../../app/reports';
import { ReportsProvider } from '../../../providers/reports/reports';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';


/**
 * Generated class for the PaymentDueCvfReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment-due-cvf-report',
  templateUrl: 'payment-due-cvf-report.html',
})
export class PaymentDueCvfReportPage {
  public treport = new Reports;
  public paymenttreport = new Reports;
  public transporter: any;
  public transporterList = [];
  public transporterNameList: any;
  public query = '';
  public categories = "Fuel";
  selectedTransporter: any;
  pumpId: number;
  productList: any;
  startDate: any;
  showEmpty: boolean;
  transporterId: number;
  productId: number;
  currentDate: any;
  tDate: any;
  eDate: any;
  sDate: any;
  FuelDetail: any[] = [];
  FuelSoldList = new Reports;
  hideTransporter: boolean = false;
  start: Date;
  endDate: any;
  show: boolean = false;
  view: boolean = false;
  showRecord: boolean = false;
  cashDueReport:any[]=[];
  FuelDueReport:any[]=[];
  TotalDueReport:any[]=[];
    //  allCash
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public storage: Storage,
    public loadingCtrl:LoadingController,
    public datePipe: DatePipe,
    public reportData: ReportsProvider,
    public basicData: BasicDataProvider,
    public appCtrl: App) {
    this.transporterId = 0;

    let backAction = this.platform.registerBackButtonAction(() => {
     this.navCtrl.setRoot("PumpRelatedReportsPage");
      backAction();
    }, 1)
    this.currentDate = new Date().toLocaleDateString();;
      
   // this.currentDate = this.datePipe.transform(this.currentDate, "yyyy-MM-dd");
  }
  ionViewDidLoad() {
    this.storage.get('pumpId').then((val) => {
      this.pumpId = val;
              
      this.showTransporter();
      this.getPayment();
    },err=>{
      console.log(err);
    });
    this.endDate = new Date().toISOString();
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 6);
    this.start = currentDate;
    this.startDate =this.start;
 
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
        if (this.transporterNameList.length == 0) {
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
    this.treport.transporterId = this.selectedTransporter[0].id;
    this.transporterId = this.treport.transporterId;
    console.log(this.transporterId);
    this.reportData.getTransporterDetail(this.treport.transporterId, this.pumpId)
      .subscribe(res => {
           ;
        this.treport = res;
        this.hideTransporter = true;
        this.getPayment();
      }, err => {

        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      });
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
        currentDate.setDate(currentDate.getDate() - 2);
        this.start = currentDate;
        new Date().toISOString();
        this.endDate = new Date().toISOString();

        this.startDate = this.start.toISOString();
        this.getPayment();
        this.show = false;
        break;
      case '4':
        currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 6);
        this.start = currentDate;
        new Date().toISOString();
        this.endDate = new Date().toISOString();

        this.startDate = this.start.toISOString();
        this.getPayment();
        this.show = false;
        break;
      case '5':
        currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 14);
        this.start = currentDate;
        new Date().toISOString();
        this.endDate = new Date().toISOString();

        this.startDate = this.start.toISOString();
        this.getPayment();
        this.show = false;
        break;
      case '6':
        currentDate = new Date();
        currentDate.setDate(1);
        this.start = currentDate;
        new Date().toISOString();
        this.endDate = new Date().toISOString();

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
  getPayment() {
    let loading = this.loadingCtrl.create({
        content: 'Please wait...',         enableBackdropDismiss: true,
    });
    loading.present();
    this.endDate = this.datePipe.transform(this.endDate, "yyyy-MM-dd");
    this.startDate = this.datePipe.transform(this.startDate, "yyyy-MM-dd");
    this.tDate = this.startDate + ',' + this.endDate;
    this.reportData.getpaymentDueCashFuel(this.pumpId, this.transporterId, this.tDate).subscribe(res => {
      loading.dismiss();
      this.paymenttreport = res;
      this.cashDueReport=res.allCashDue;
      this.FuelDueReport=res.allFuelDue;
      this.TotalDueReport=res.allTotalDue;
    //  allCashDue;allFuelDue;allTotalDue;
    }, err => {

      this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      loading.dismiss();
    });
  }
  dateChanged() {
          
    this.startDate = this.sDate;
    this.endDate = this.eDate;
    this.getPayment();
  }
  menuClick() {
    this.basicData.checkPumpCount();
  }
  home() {
   this.navCtrl.setRoot("CreditSalesReportPage")
  }
}
