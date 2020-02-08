import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { IonicPage, NavController, App, Platform, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Reports } from '../../../app/reports';
import { ReportsProvider } from '../../../providers/reports/reports';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';

@IonicPage()
@Component({
  selector: 'page-loyalty-summary',
  templateUrl: 'loyalty-summary.html',
})
export class LoyaltySummaryPage {
  public loyalty = new Reports;
  loyaltyDetail: any[] = [];
  DriverList: any[] = [];
  public pumpId: number;
  public transporterId: number;
  public driverId: number;
  public productRate: any;
  public startDate: any;
  public start: Date;
  public endDate: String;
  currentDate: any;
  tDate: any;
  eDate: any;
  sDate: any;
  show: boolean = false;
  view: boolean = false;
  hide: boolean = false;
  showRecord: boolean = false;
  constructor(public navCtrl: NavController,
    public platform: Platform,
    public appCtrl: App,
    public loadingCtrl:LoadingController,
    public datepipe: DatePipe,
    public basicData: BasicDataProvider,
    public storage: Storage,
    public reportData: ReportsProvider,
  ) {
    let backAction = this.platform.registerBackButtonAction(() => {
     this.navCtrl.setRoot("LoyaltySalesReportPage");
      backAction();
    }, 1);
    this.driverId = 0;
    this.currentDate = new Date().toLocaleDateString();;
      
   // this.currentDate = this.datepipe.transform(this.currentDate, "yyyy-MM-dd");
  }

  ionViewDidLoad() {
    this.storage.get("pumpId").then(val => {
      this.pumpId = val;
      this.showDriver();
      this.endDate = new Date().toISOString();
      var currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - 6);
      this.start = currentDate;
      this.startDate = this.start;
      //this.startDate = new Date().toISOString();
   
      this.getLoyalitySummaray();
    },err=>{
      console.log(err);
    })
  }

  doRefresh(refresher) {
    this.ionViewDidLoad();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
  showDriver() {
    this.reportData.getLDriverList(this.pumpId).subscribe(res => {
      this.DriverList = res;
    }, err => {

      this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
    })
  }
  DriverSelect(driverId) {
    this.driverId = driverId;
    this.getLoyalitySummaray();
  }


  home() {
   this.navCtrl.setRoot("LoyaltySalesReportPage");
  }
  onChange(value) {
       
    switch (value) {
      case '1':
        this.startDate = new Date().toISOString();
        this.endDate = new Date().toISOString();
        this.getLoyalitySummaray();
        this.show = false;
        break;

      case '2':
        var currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 1);
        this.start = currentDate;
        this.startDate = this.start.toISOString();
        this.endDate = this.startDate;
        this.getLoyalitySummaray();
        this.show = false;
        break;
      case '3':
        currentDate = new Date();
        this.endDate = new Date().toISOString();
        currentDate.setDate(currentDate.getDate() - 2);
        this.start = currentDate;
        this.startDate = this.start.toISOString();
        this.getLoyalitySummaray();
        this.show = false;
        break;
      case '4':
        currentDate = new Date();
        this.endDate = new Date().toISOString();
        currentDate.setDate(currentDate.getDate() - 6);
        this.start = currentDate;
        this.startDate = this.start.toISOString();
        this.getLoyalitySummaray();
        this.show = false;
        break;
      case '5':
        currentDate = new Date();
        this.endDate = new Date().toISOString();
        currentDate.setDate(currentDate.getDate() - 14);
        this.start = currentDate;
        this.startDate = this.start.toISOString();
        this.getLoyalitySummaray();
        this.show = false;
        break;
      case '6':
        currentDate = new Date();
        this.endDate = new Date().toISOString();
        currentDate.setDate(1);
        this.start = currentDate;
        this.startDate = this.start.toISOString();
        this.getLoyalitySummaray();
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
        this.getLoyalitySummaray();
        break;
      case '8':
        this.show = true;
             
        break;
    }
  }
  dateChanged() {
          
    this.startDate = this.sDate;
    this.endDate = this.eDate;
    this.getLoyalitySummaray();
  }
  getLoyalitySummaray() {
    let loading = this.loadingCtrl.create({
        content: 'Please wait...',         enableBackdropDismiss: true,
    });
    loading.present();
  this.endDate = this.datepipe.transform(this.endDate, "yyyy-MM-dd");
    this.startDate = this.datepipe.transform(this.startDate, "yyyy-MM-dd");
    this.tDate = this.startDate + ',' + this.endDate;
        
    this.reportData.getLoyaltySaleSummary(this.pumpId, this.driverId, this.tDate).subscribe(res => {
         ;
      loading.dismiss();
      this.loyalty = res;
      this.loyaltyDetail = res.AllLS;
      if (res.sumPoints == null) {
        res.sumPoints = 0;
      }
      if (this.loyalty.DriverData == null || this.loyalty.DriverData.length == 0) {
        this.hide = false;
      }
      else {
        this.hide = true;
      }
    }
    , err => {

      this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      loading.dismiss();
    })
  }
  menuClick() {
    this.basicData.checkPumpCount();
  }
}
