import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, App, LoadingController } from 'ionic-angular';
import { DSMReports } from '../../../app/DSMReports';
import { DsmReportsProvider } from '../../../providers/dsm-reports/dsm-reports';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';
import { DatePipe } from '@angular/common';

/**
 * Generated class for the PaymodeWiseSalePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-paymode-wise-sale',
  templateUrl: 'paymode-wise-sale.html',
})
export class PaymodeWiseSalePage {
  
  PayModeWiseList = new DSMReports;
  dsm=new DSMReports;

    constructor(public navCtrl: NavController,
      public dsmdata:DsmReportsProvider,
      public navParams: NavParams,
      public loadingCtrl:LoadingController,
      public platform:Platform,
      public appCtrl:App,
      public basicData:BasicDataProvider,
      public storage:Storage,
      public datePipe:DatePipe) {
      let backAction = this.platform.registerBackButtonAction(() => {
       this.navCtrl.setRoot("DsmReportsPage");
        backAction();
      }, 1)
      this.dsm.currentDate = new Date().toLocaleDateString();;
    //  this.dsm.currentDate = this.datePipe.transform(this.dsm.currentDate, "yyyy-MM-dd");
    }
  
    ionViewDidLoad() {
      this.storage.get("employeeId").then(val => {
        this.dsm.employeeId=val;
      },err=>{
        console.log(err);
      });
      this.storage.get("name").then(val => {
        this.dsm.name=val;
      },err=>{
        console.log(err);
      });
      this.storage.get("activeLS").then(val => {
        this.dsm.activeLS=val;
      },err=>{
        console.log(err);
      });
      this.storage.get("pumpId").then(val => {
        this.dsm.pumpId = val;
        this.dsm.endDate = new Date().toISOString();
        var currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 6);
        this.dsm.start = currentDate;
        this.dsm.startDate = this.dsm.start;
        this.getPaymodeWiseSale();
      },err=>{
        console.log(err);
      });
   
    }
    onChange(value) {
      switch (value) {
        case '1':
          this.dsm.startDate = new Date().toISOString();
          this.dsm.endDate = new Date().toISOString();
          this.getPaymodeWiseSale();
          this.dsm.show = false;
          break;
  
        case '2':
          var currentDate = new Date();
          currentDate.setDate(currentDate.getDate() - 1);
          this.dsm.start = currentDate;
          this.dsm.startDate = this.dsm.start.toISOString();
          this.dsm.endDate = this.dsm.startDate;
          this.getPaymodeWiseSale();
          this.dsm.show = false;
          break;
        case '3':
          currentDate = new Date();
          this.dsm.endDate = new Date().toISOString();
          currentDate.setDate(currentDate.getDate() - 2);
          this.dsm.start = currentDate;
          this.dsm.startDate = this.dsm.start.toISOString();
          this.getPaymodeWiseSale();
          this.dsm.show = false;
          break;
        case '4':
          currentDate = new Date();
          this.dsm.endDate = new Date().toISOString();
          currentDate.setDate(currentDate.getDate() - 6);
          this.dsm.start = currentDate;
          this.dsm.startDate = this.dsm.start.toISOString();
          this.getPaymodeWiseSale();
          this.dsm.show = false;
          break;
        case '5':
          currentDate = new Date();
          this.dsm.endDate = new Date().toISOString();
          currentDate.setDate(currentDate.getDate() - 14);
          this.dsm.start = currentDate;
          this.dsm.startDate = this.dsm.start.toISOString();
          this.getPaymodeWiseSale();
          this.dsm.show = false;
          break;
        case '6':
          currentDate = new Date();
          this.dsm.endDate = new Date().toISOString();
          currentDate.setDate(1);
          this.dsm.start = currentDate;
          this.dsm.startDate = this.dsm.start.toISOString();
          this.getPaymodeWiseSale();
          this.dsm.show = false;
          break;
        case '7':
          currentDate = new Date();
  
          currentDate.setDate(1);
          var currentMonth = currentDate.getMonth() - 1;
          currentDate.setMonth(currentMonth);
          this.dsm.start = currentDate;
          this.dsm.startDate = this.dsm.start.toISOString();
          // var currentDate = new Date();
          var date = new Date(), y = date.getFullYear(), m = date.getMonth();
          var lastDay = new Date(y, m, 0);
          this.dsm.start = lastDay;
          this.dsm.endDate = this.dsm.start.toISOString();
          this.getPaymodeWiseSale();
          break;
        case '8':
          this.dsm.show = true;
          break;
      }
    }
    dateChanged(item) {
      if (this.dsm.sDate == undefined || this.dsm.eDate == undefined) {
      }
      else {
        this.dsm.startDate = this.dsm.sDate;
        this.dsm.endDate = this.dsm.eDate;
        this.getPaymodeWiseSale();
      }
  
    }
    ProductSelect(reqFuel)
    {
      this.dsm.saleId=reqFuel;
      this.getPaymodeWiseSale();
    }
    getPaymodeWiseSale() {
      let loading = this.loadingCtrl.create({
          content: 'Please wait...',         enableBackdropDismiss: true,
      });
      
      loading.present();
     
      this.dsm.endDate = this.datePipe.transform(this.dsm.endDate, "yyyy-MM-dd");
      this.dsm.startDate = this.datePipe.transform(this.dsm.startDate, "yyyy-MM-dd");
      this.dsm.tDate = this.dsm.startDate + ',' + this.dsm.endDate;
      this.dsmdata.getPaymodeWiseSale(this.dsm.employeeId,this.dsm.saleId,this.dsm.tDate).subscribe(res=>{
        loading.dismiss();
        console.log("Load",res)
        this.PayModeWiseList = res;
        this.dsm.PayModeWiseDetail = this.PayModeWiseList.productSales;
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
