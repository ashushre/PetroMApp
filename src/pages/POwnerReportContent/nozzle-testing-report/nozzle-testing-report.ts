import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, App } from 'ionic-angular';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';
import { DatePipe } from '@angular/common';
import { ReportsProvider } from '../../../providers/reports/reports';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the NozzleTestingReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-nozzle-testing-report',
  templateUrl: 'nozzle-testing-report.html',
})
export class NozzleTestingReportPage {
  pumpId: number;
  productList: any;
  startDate: any;
  productId: number;
  currentDate: any;
  pageno:any;
  tDate: any;
  eDate: any;
  sDate: any;
  nozzleReport:any[];
  productTotal:number;
  //FuelSoldList = new Reports;
  start: Date;
  endDate: any;
  show: boolean = false;
  view: boolean = false;
  showRecord: boolean = false;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public loadingCtrl:LoadingController,
    public storage: Storage,
    public datePipe: DatePipe,
    public reportData: ReportsProvider,
    public basicData: BasicDataProvider,
    public appCtrl:App) {
    this.productId = 0;
    this.pageno = 1;
    let backAction = this.platform.registerBackButtonAction(() => {
     this.navCtrl.setRoot("PumpRelatedReportsPage");
      backAction();
    }, 1)
    this.currentDate = new Date().toLocaleDateString();
   // this.currentDate = this.datePipe.transform(this.currentDate, "yyyy-MM-dd");
  }

  ionViewDidLoad() {
    this.storage.get("pumpId").then(val => {
      this.pumpId = val;
      this.startDate = new Date().toISOString();
        this.endDate = new Date().toISOString();
     this.getNozzleTesting();
      // for (let i = 0; i < 5; i++) {
      //   this.FuelDetail.push( this.FuelDetail.length );
      // }
    },err=>{
      console.log(err);
    });
  }

  home() {
   this.navCtrl.setRoot("PumpRelatedReportsPage");
  }

  onChange(value) {
    switch (value) {
      case '1':
        this.startDate = new Date().toISOString();
        this.endDate = new Date().toISOString();
        this.getNozzleTesting();
        this.show = false;
        break;

      case '2':
        var currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 1);
        this.start = currentDate;
        this.startDate = this.start.toISOString();
        this.endDate = this.startDate;
        this.getNozzleTesting();
        this.show = false;
        break;
      case '3':
        currentDate = new Date();
        this.endDate = new Date().toISOString();
        currentDate.setDate(currentDate.getDate() - 2);
        this.start = currentDate;
        this.startDate = this.start.toISOString();
        this.getNozzleTesting();
        this.show = false;
        break;
      case '4':
        currentDate = new Date();
        this.endDate = new Date().toISOString();
        currentDate.setDate(currentDate.getDate() - 6);
        this.start = currentDate;
        this.startDate = this.start.toISOString();
        this.getNozzleTesting();
        this.show = false;
        break;
      case '5':
        currentDate = new Date();
        this.endDate = new Date().toISOString();
        currentDate.setDate(currentDate.getDate() - 14);
        this.start = currentDate;
        this.startDate = this.start.toISOString();
        this.getNozzleTesting();
        this.show = false;
        break;
      case '6':
        currentDate = new Date();
        this.endDate = new Date().toISOString();
        currentDate.setDate(1);
        this.start = currentDate;
        this.startDate = this.start.toISOString();
        this.getNozzleTesting();
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
        this.getNozzleTesting();
        break;
      case '8':
        this.show = true;
        break;
    }
  }
  dateChanged(item) {
    if (this.sDate == undefined || this.eDate == undefined) {
    }
    else {
      this.startDate = this.sDate;
      this.endDate = this.eDate;
      this.getNozzleTesting();
    }

  }
   
  getNozzleTesting() {
    let loading = this.loadingCtrl.create({
        content: 'Please wait...',         enableBackdropDismiss: true,
    });

    loading.present();
    this.endDate = this.datePipe.transform(this.endDate, "yyyy-MM-dd");
    this.startDate = this.datePipe.transform(this.startDate, "yyyy-MM-dd");
    this.tDate = this.startDate + ',' + this.endDate;
    this.reportData.getNozzleTesting(this.pumpId,this.tDate).subscribe(res=>{
     loading.dismiss();
          this.nozzleReport=res;
            console.log(res);
       this.productTotal=0;
            for(var i=0;i<this.nozzleReport.length;i++)
            {
              console.log(this.productTotal);
              this.productTotal+=parseFloat(this.nozzleReport[i].testingQty);
            }
      if (this.nozzleReport.length == 0) {
        this.showRecord = true;
        this.view = false;
      }
      else {
        this.showRecord = false;
        this.view = true;
      }
    }, err => {
      this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      loading.dismiss();
    })
  }
  menuClick() {
    this.basicData.checkPumpCount();
  }
}
