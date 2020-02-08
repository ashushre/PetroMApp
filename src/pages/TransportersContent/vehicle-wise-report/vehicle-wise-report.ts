import { Component } from '@angular/core';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';
import { IonicPage, App, NavController, NavParams, LoadingController } from 'ionic-angular';
import { TransporterReportPage } from '../../TransportersContent/transporter-report/transporter-report';
import { DatePipe } from '@angular/common';
import { Storage } from '@ionic/storage';
import { TransDataProvider } from '../../../providers/trans-data/trans-data';
import { TransporterReportProvider } from '../../../providers/transporter-report/transporter-report';
import { transporterReport } from '../../../app/transporterReport';
import { SalesDataProvider } from '../../../providers/sales-data/sales-data';

/**
 * Generated class for the VehicleWiseReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vehicle-wise-report',
  templateUrl: 'vehicle-wise-report.html',
})
export class VehicleWiseReportPage {

  transporterId: number;
  productList: any;
  vehicleId: number;
  startDate: any;
  pumpId:number;
  productId: number;
  currentDate: any;
  tDate: any;
  eDate: any;
  sDate: any;
  pumpList: any;
  vehicleReportList: any[] = [];
  vehicles: any;
  vehicleReport = new transporterReport;
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
    public saleData:SalesDataProvider,
    public storage: Storage,
    public loadingCtrl: LoadingController,
    public navParams: NavParams) {
    this.currentDate = new Date().toLocaleDateString();
      
  //  this.currentDate = this.datePipe.transform(this.currentDate, "yyyy-MM-dd");
  }

  ionViewDidLoad() {
    this.storage.get("transporterId").then(val => {
      this.transporterId = val;
      this.showVehicles();
      this.showPumps();
      this.endDate = new Date().toISOString();
      var currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - 6);
      this.start = currentDate;
      this.startDate = this.start;
   
    },err=>{
      console.log(err);
    });
  }

  showVehicles() {
      this.saleData.getVehicles(this.transporterId)
        .subscribe(res => {
          this.vehicles = res.filter(v => v.active == 1);
          this.vehicleId=this.vehicles[0].id;
        //  this.getVehicleWiseConsumed();
      }, err => {
        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      })
  }
  showPumps() {
    this.transData.getPumpList(this.transporterId)
      .subscribe(res => {
        this.pumpList = res;
        this.pumpId=res[0].pumpId;
           
      this.getVehicleWiseConsumed();

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
        this.getVehicleWiseConsumed();
        this.show = false;
        break;

      case '2':
        var currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 1);
        this.start = currentDate;
        this.startDate = this.start.toISOString();
        this.endDate = this.startDate;
        this.getVehicleWiseConsumed();
        this.show = false;
        break;
      case '3':
        currentDate = new Date();
        this.endDate = new Date().toISOString();
        currentDate.setDate(currentDate.getDate() - 2);
        this.start = currentDate;
        this.startDate = this.start.toISOString();
        this.getVehicleWiseConsumed();
        this.show = false;
        break;
      case '4':
        currentDate = new Date();
        this.endDate = new Date().toISOString();
        currentDate.setDate(currentDate.getDate() - 6);
        this.start = currentDate;
        this.startDate = this.start.toISOString();
        this.getVehicleWiseConsumed();
        this.show = false;
        break;
      case '5':
        currentDate = new Date();
        this.endDate = new Date().toISOString();
        currentDate.setDate(currentDate.getDate() - 14);
        this.start = currentDate;
        this.startDate = this.start.toISOString();
        this.getVehicleWiseConsumed();
        this.show = false;
        break;
      case '6':
        currentDate = new Date();
        this.endDate = new Date().toISOString();
        currentDate.setDate(1);
        this.start = currentDate;
        this.startDate = this.start.toISOString();
        this.getVehicleWiseConsumed();
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
        this.getVehicleWiseConsumed();
        break;
      case '8':
        this.show = true;
             
        break;
    }
  }
  getVehicleWiseConsumed() {
    let loading = this.loadingCtrl.create({
        content: 'Please wait...',         enableBackdropDismiss: true,
    });
    loading.present();
    this.endDate = this.datePipe.transform(this.endDate, "yyyy-MM-dd");
    this.startDate = this.datePipe.transform(this.startDate, "yyyy-MM-dd");
    this.tDate = this.startDate + ',' + this.endDate;
        console.log()
    this.transReport.getVehicleWiseConsumed(this.transporterId,this.pumpId,this.vehicleId,this.tDate).subscribe(res => {
         
      loading.dismiss();
      this.vehicleReport = res;
      this.vehicleReportList = res.sales;
    },err => {
      loading.dismiss();
      this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
    })
  }
  selectVehicle(reqId) {
    this.vehicleId = reqId;
    this.getVehicleWiseConsumed();
  }
  dateChanged(item) {
    if (this.sDate == undefined || this.eDate == undefined) {
    }
    else {
      this.startDate = this.sDate;
      this.endDate = this.eDate;
      this.getVehicleWiseConsumed();
    }

  }
  selectPump(reqPump) {
    console.log(reqPump)
    this.pumpId = reqPump;
    this.getVehicleWiseConsumed();
  }

}
