import { Storage } from '@ionic/storage';
import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, App, LoadingController } from 'ionic-angular';
import { DsmReportsProvider } from '../../../providers/dsm-reports/dsm-reports';
import { DSMReports } from '../../../app/DSMReports';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';


/**
 * Generated class for the DayWiseSalePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-day-wise-sale',
  templateUrl: 'day-wise-sale.html',
})
export class DayWiseSalePage {
public pumpId:number;
public employeeId:number;
productList: any;
startDate: any;
productId: number;
currentDate: any;
tDate: any;
eDate: any;
sDate: any;
DayWiseDetail: any[] = [];
DayWiseList = new DSMReports;
start: Date;
name:any;
endDate: any;
show: boolean = false;
view: boolean = false;
showRecord: boolean = false;
  constructor(public navCtrl: NavController,
    public dsmdata:DsmReportsProvider, 
    public navParams: NavParams,
    public platform:Platform,
    public appCtrl:App,
    public loadingCtrl:LoadingController,
    public basicData:BasicDataProvider,
    public storage:Storage,
    public datePipe:DatePipe) {
    let backAction = this.platform.registerBackButtonAction(() => {
     this.navCtrl.setRoot("DsmReportsPage");
      backAction();
    })
    this.currentDate = new Date().toLocaleDateString();;
//    this.currentDate = this.datePipe.transform(this.currentDate, "yyyy-MM-dd");
  }

  ionViewDidLoad() {
    this.storage.get("employeeId").then(val => {
      this.employeeId=val;
    },err=>{
      console.log(err);
    });
    this.storage.get("name").then(val => {
      this.name=val;
    },err=>{
      console.log(err);
    });
    this.storage.get("pumpId").then(val => {
      this.pumpId = val;
      this.endDate = new Date().toISOString();
      var currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - 6);
      this.start = currentDate;
      this.startDate = this.start;
      this.getDayWiseSale();
    },err=>{
      console.log(err);
    });
 
  }
  onChange(value) {
    switch (value) {
      case '1':
        this.startDate = new Date().toISOString();
        this.endDate = new Date().toISOString();
        this.getDayWiseSale();
        this.show = false;
        break;

      case '2':
        var currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 1);
        this.start = currentDate;
        this.startDate = this.start.toISOString();
        this.endDate = this.startDate;
        this.getDayWiseSale();
        this.show = false;
        break;
      case '3':
        currentDate = new Date();
        this.endDate = new Date().toISOString();
        currentDate.setDate(currentDate.getDate() - 2);
        this.start = currentDate;
        this.startDate = this.start.toISOString();
        this.getDayWiseSale();
        this.show = false;
        break;
      case '4':
        currentDate = new Date();
        this.endDate = new Date().toISOString();
        currentDate.setDate(currentDate.getDate() - 6);
        this.start = currentDate;
        this.startDate = this.start.toISOString();
        this.getDayWiseSale();
        this.show = false;
        break;
      case '5':
        currentDate = new Date();
        this.endDate = new Date().toISOString();
        currentDate.setDate(currentDate.getDate() - 14);
        this.start = currentDate;
        this.startDate = this.start.toISOString();
        this.getDayWiseSale();
        this.show = false;
        break;
      case '6':
        currentDate = new Date();
        this.endDate = new Date().toISOString();
        currentDate.setDate(1);
        this.start = currentDate;
        this.startDate = this.start.toISOString();
        this.getDayWiseSale();
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
        this.getDayWiseSale();
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
      this.getDayWiseSale();
    }

  }
  getDayWiseSale() {
    let loading = this.loadingCtrl.create({
        content: 'Please wait...',         enableBackdropDismiss: true,
    });
    loading.present();
    this.endDate = this.datePipe.transform(this.endDate, "yyyy-MM-dd");
    this.startDate = this.datePipe.transform(this.startDate, "yyyy-MM-dd");
    this.tDate = this.startDate + ',' + this.endDate;
    this.dsmdata.getDayWiseSale(this.pumpId,this.employeeId,this.tDate).subscribe(res=>{
      loading.dismiss();
      console.log(res)
      this.DayWiseList = res;
       this.DayWiseDetail = this.DayWiseList.shifts;
    }, err => {
      this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
loading.dismiss();
    })
  }
  menuClick() {
    this.basicData.checkPumpCount();
  }
  home(){
   this.navCtrl.setRoot("DsmReportsPage");
  }
}
