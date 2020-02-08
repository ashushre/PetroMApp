//import { DateTimePipe } from './../../../pipes/date-time/date-time';

import { SalesDataProvider } from './../../../providers/sales-data/sales-data';
import { LoginPage } from './../../ALLContent/login/login';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Platform, App, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DSMReports } from '../../../app/DSMReports';
import { DsmReportsProvider } from '../../../providers/dsm-reports/dsm-reports';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';
import { ignoreElements } from 'rxjs/operator/ignoreElements';

@Component({
  selector: 'page-dsm-home',
  templateUrl: 'dsm-home.html',
  // styleUrls: ['app.scss'],
})
export class DsmHomePage {
  detailSales = new DSMReports();
  dsmVariables = new DSMReports();
 
  nextshiftAssign:number;
  nozzleList: any[] = [];
  machineList: any[] = [];
  public error: any;
  public error1: any;
  public error2: any;
  public my_Class = 'style1';
  timer: number;
  public flag;
  shiftCloseTime:any;
  shiftDateLimit:any;
  shiftCloseBeforeTime:any;
  shiftCloseAfterTime:any;
  currentDateTime:any;
  currentTime: any;
  currentDate: any;


  constructor(
    public navCtrl: NavController,
    public salesData: SalesDataProvider,
    public toast: ToastController,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public appCtrl: App,
    public dsmreport: DsmReportsProvider,
    public alertCtrl: AlertController,
    public storage: Storage,
    public basicData: BasicDataProvider,
    public navParams: NavParams) {
    this.currentTime = new Date().toLocaleTimeString();
    this.currentDate = new Date().toLocaleDateString();
  this.currentDate = new Date().toISOString().slice(0,10); 
  let currentcheck=this.currentTime.slice(8,11);
  console.log(currentcheck)

    this.shiftDateLimit = this.currentDate + ' 5:30:00';
this.shiftCloseAfterTime= '5:45:00 AM';
this.shiftCloseTime='5:45:00 AM';
this.shiftCloseBeforeTime='5:30:00 AM';
    console.log(this.currentDate, this.currentTime);
    let currentTime123 = new Date().toLocaleTimeString();
if(currentcheck=='PM')
{

  var sampleTime=  this.transform(currentTime123);
  this.currentDateTime=this.currentDate+' '+sampleTime;
}
else
{
  var sampleTime=  this.transform1(currentTime123);
  this.currentDateTime=this.currentDate+' '+sampleTime;
}


 
    this.flag = this.basicData.flag;

    //Back Buttom
    let backAction = this.platform.registerBackButtonAction(() => {
      let alert = this.alertCtrl.create({
        message: 'Do you really want to exit?',
        enableBackdropDismiss: false,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',

            handler: () => {

              this.navCtrl.setRoot(DsmHomePage);
            }
          },
          {
            text: 'Ok',
            handler: () => {
              if (navCtrl.canGoBack()) {
                navCtrl.pop();
              } else {
                platform.exitApp();
              }
            }
          }
        ]
      });
      alert.present();
      backAction();
    }, 1)
  }


  ionViewDidLoad() {
    console.log("load")

    var sam = this.navCtrl.getActive().index;

    console.log(sam);
    console.log(this.currentTime);
    this.getStorageInfo();
    // this.presentAlertConfirm(); 

  }


  getStorageInfo() {
    this.storage.get('employeeId').then((val) => {
      this.dsmVariables.employeeId = val;
    }, err => {
      console.log(err);
    });
    this.storage.get('flag').then((val) => {
      this.dsmVariables.flag = val;
      console.log(val)
    }, err => {
      console.log(err);
    });
    this.storage.get('username').then((val) => {
      this.dsmVariables.username = val;
    }, err => {
      console.log(err);
    });
    this.storage.get('name').then((val) => {
      this.dsmVariables.name = val;
    }, err => {
      console.log(err);
    });
    this.storage.get('empShiftId').then((val) => {
      this.dsmVariables.empShiftId = val;
    }, err => {
      console.log(err);
    });
    this.storage.get('activeCS').then((val) => {
      this.dsmVariables.activeCS = val;
    }, err => {
      console.log(err);
    });
    this.storage.get('activeLS').then((val) => {
      this.dsmVariables.activeLS = val;
    }, err => {
      console.log(err);
    });
    this.storage.get('pumpId').then((val) => {
      this.dsmVariables.pumpId = val;
      this.salesData.getDSMNozzles(this.dsmVariables.pumpId, this.dsmVariables.employeeId, 1)
        .subscribe(res => {
          //this.nozzleList=res;
          console.log(res, this.nozzleList);
          var success1 = JSON.stringify(res);
          this.error1 = JSON.parse(success1).error;
          console.log(res, this.nozzleList, this.error1);
        }, err => {
          this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");

        });
      this.getDSMDashboard();
    });
  }



  logOut() {
    let alert = this.alertCtrl.create({
      message: 'Do you really want to Logout?',
      enableBackdropDismiss: true,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.navCtrl.setRoot(LoginPage);
            this.storage.clear();
          }
        }
      ]
    });
    alert.present();

  }

  doRefresh(refresher) {
    this.ionViewDidLoad();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }


  getDSMDashboard() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...', enableBackdropDismiss: true,
    });
    loading.present();
    this.dsmVariables.parameter = this.dsmVariables.pumpId + ',' + this.dsmVariables.employeeId + ',' + this.dsmVariables.empShiftId + ',' + this.dsmVariables.isTotalizer;
    console.log(this.dsmVariables.parameter);
    this.error2=undefined;
    this.dsmreport.getDSMDashboard(this.dsmVariables.parameter).subscribe(res => {
      console.log(res);
      loading.dismiss();

      this.dsmVariables.status = res.shiftStatus;
      console.log(res.shiftStatus, this.dsmVariables.status)
      this.dsmVariables.machine = res.machines;
      for (var i = 0; i < this.dsmVariables.machine.length; i++) {
        this.machineList[i] = " " + this.dsmVariables.machine[i].machineName + this.dsmVariables.machine[i].nozzleName;
      }

      if (this.dsmVariables.status == 1) {
        this.shiftMachineConfirmation();
      }
      else {

      }
      this.dsmVariables.dsmReportList = res.getDSMFuelSale;
      this.dsmVariables.cashtoSubmitted = res.getPendingCash;
      this.dsmVariables.getCashSubmitted = res.getCashSubmitted;
      if(res.shiftTime!==null)
      {
        this.dsmVariables.shiftTime = res.shiftTime[0].fromTime;
      }
      else{
        this.dsmVariables.shiftTime=null;
      }

      console.log("Tiem" + this.dsmVariables.shiftTime)
      this.nozzleList = res.getDSMNozzles;
      this.detailSales = res.getDSMSale;
      if (res.totalSales.original !== undefined) {
        var success2 = JSON.stringify(res.totalSales.original);
        this.error2 = JSON.parse(success2).error;
      }
      if (res.getDSMNozzles.original !== undefined) {
        var success = JSON.stringify(res.getDSMNozzles.original);
        this.error = JSON.parse(success).error;
        console.log(this.error);
      }
      if (this.error1 == "You can not fill Totalizer as no other SaleMan is not assigned yet..!!!") {
        this.nextshiftAssign = 0;
      }
      else {
        this.nextshiftAssign = 1;
      }


      if (this.dsmVariables.activeCS == 0 || this.dsmVariables.activeLS == 0) {
        this.my_Class = 'col12';
        console.log(this.dsmVariables.activeCS, this.dsmVariables.activeLS)
      }
      else {
        this.my_Class = 'col6';
        console.log(this.dsmVariables.activeCS, this.dsmVariables.activeLS)
      }
      this.shiftCloseAlert();

    }
      , err => {
        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
        loading.dismiss();
      });
  }

  editProfile() {
    this.navCtrl.setRoot('DsmProfilePage');
  }


  CreditSale() {
    console.log(this.dsmVariables.shiftTime+"<"+this.shiftDateLimit, this.currentDateTime+">"+this.shiftDateLimit+" 1=="+this.nextshiftAssign)
    let currentDateTime = new Date(this.currentDateTime);
    let shiftDateLimit=new Date(this.shiftDateLimit);


    if (this.error == undefined || this.error == null) {

      if ( (this.dsmVariables.shiftTime!==null) && (this.dsmVariables.shiftTime < this.shiftDateLimit) && (currentDateTime >  shiftDateLimit) &&( this.nextshiftAssign == 1 )) {
        console.log(3)
        this.basicData.sendErrorNotification("It's shift closing time you cannot do any sales.Please close the Shift");
      }
     else if (( this.dsmVariables.shiftTime!==null )&& (this.dsmVariables.shiftTime < this.shiftDateLimit) && (currentDateTime >  shiftDateLimit) &&  (this.nextshiftAssign == 0 )) {
        this.basicData.sendErrorNotification(" It's shift closing time you cannot do any sales.Please contact  manager to assign shift for next dsm.Then close your  shift");
        console.log(4)
    }
      else {
        console.log(5)
        this.navCtrl.setRoot('CreditSalePage');
     }

    }
    else {
      console.log(6)
      this.basicData.sendErrorNotification("" + this.error);
    }
  }

  cashSale() {
    let currentDateTime = new Date(this.currentDateTime);
    let shiftDateLimit=new Date(this.shiftDateLimit);

    if (this.error == undefined || this.error == null) {
      if ( this.dsmVariables.shiftTime!==null && this.dsmVariables.shiftTime < this.shiftDateLimit && currentDateTime > shiftDateLimit &&  this.nextshiftAssign == 1 ) {
 
        this.basicData.sendErrorNotification("It's shift closing time you cannot do any sales.Please close the Shift");
      }
      else if ( this.dsmVariables.shiftTime!==null && this.dsmVariables.shiftTime < this.shiftDateLimit && currentDateTime > shiftDateLimit &&  this.nextshiftAssign == 0 ) {
        this.basicData.sendErrorNotification(" It's shift closing time you cannot do any sales.Please contact  manager to assign shift for next dsm.Then close your  shift");

      }
      else {
        this.navCtrl.setRoot('CashSalePage');
      }
    }
    else {
      this.basicData.sendErrorNotification("" + this.error);
    }
  }

  saleList() {
    let currentDateTime = new Date(this.currentDateTime);
    let shiftDateLimit=new Date(this.shiftDateLimit);
    if (this.error == undefined || this.error == null) {

      if ( this.dsmVariables.shiftTime!==null && this.dsmVariables.shiftTime < this.shiftDateLimit && currentDateTime > shiftDateLimit && this.nextshiftAssign == 1 ) {
 
        this.basicData.sendErrorNotification("It's shift closing time you cannot do any sales.Please close the Shift");
      }
      else if ( this.dsmVariables.shiftTime!==null && this.dsmVariables.shiftTime < this.shiftDateLimit &&  currentDateTime >shiftDateLimit && this.nextshiftAssign == 0 ) {
        this.basicData.sendErrorNotification(" It's shift closing time you cannot do any sales.Please contact  manager to assign shift for next dsm.Then close your  shift");

      }
        else {
          this.navCtrl.setRoot('SalesListPage');
        }
    }
    else {
      this.basicData.sendErrorNotification("" + this.error);
    }
  }

  otherSale() {
    let currentDateTime = new Date(this.currentDateTime);
    let shiftDateLimit=new Date(this.shiftDateLimit);
    if (this.error == undefined || this.error == null) {
      //this.navCtrl.setRoot('SingleSalesPage');
      if ( this.dsmVariables.shiftTime!==null && this.dsmVariables.shiftTime < this.shiftDateLimit && currentDateTime > shiftDateLimit && this.nextshiftAssign == 1 ) {
 
        this.basicData.sendErrorNotification("It's shift closing time you cannot do any sales.Please close the Shift");
      }
      else if ( this.dsmVariables.shiftTime!==null && this.dsmVariables.shiftTime < this.shiftDateLimit &&  currentDateTime > shiftDateLimit &&  this.nextshiftAssign == 0 ) {
        this.basicData.sendErrorNotification(" It's shift closing time you cannot do any sales.Please contact  manager to assign shift for next dsm.Then close your  shift");

      }
      else {
        this.navCtrl.setRoot('SingleSalesPage');
      }

    }
    else {
      this.basicData.sendErrorNotification("" + this.error);
    }


  }


  noozleTotal() {

    if (this.error1 == undefined || this.error1 == null) {
      this.navCtrl.setRoot('NozzleTotalizerPage');
    }
    else {
      this.basicData.sendErrorNotification("" + this.error1);
    }
  }

  regularSale() {
    if (this.error2 == undefined || this.error2 == null) {
      this.navCtrl.setRoot('RegularCashPage');
    }
    else {
      this.basicData.sendErrorNotification("" + this.error2);
    }

  }



  shiftMachineConfirmation() {

    const alert = this.alertCtrl.create({
      title: 'Please Check <br>कृपया जांचें',
      enableBackdropDismiss: false,
      message: '<span style="line-height: 1.5">Your Duty on<br>आपकी ड्यूटी<br><strong>' + this.machineList + '</strong></span>',
      buttons: [
        {
          text: 'Wrong गलत',
          role: 'cancel',
          cssClass: 'wrongbtn',
          handler: (blah) => {
            this.basicData.sendErrorNotification('Please contact to Manager')
            this.navCtrl.setRoot(LoginPage);
            this.storage.clear();
            console.log('cancel');
          }
        }, {
          text: 'Correct सही',
          cssClass: 'correctbtn',
          handler: () => {
            let loading = this.loadingCtrl.create({
              content: 'Please wait...', enableBackdropDismiss: true,
            });
            loading.present();
            this.dsmreport.getConfirmation(this.dsmVariables.pumpId, this.dsmVariables.empShiftId).subscribe(res => {
              console.log(res);
              var success = JSON.stringify(res);
              var errorMsg = JSON.parse(success).error;
              if (errorMsg == undefined) {
                this.salesData.getDSMNozzles(this.dsmVariables.pumpId, this.dsmVariables.employeeId, 0)
                  .subscribe(res => {
                    this.nozzleList = res;
                    console.log(res, this.nozzleList);
                    var success1 = JSON.stringify(res);
                    this.salesData.getDSMNozzles(this.dsmVariables.pumpId, this.dsmVariables.employeeId, 1)
                    .subscribe(res1 => {
                    //  var succ=res1;
                    loading.dismiss();
                      var succ = JSON.stringify(res1);
                    this.error1 = JSON.parse(succ).error;
                    console.log(res, this.nozzleList, this.error1);
                    });
                  }, err => {
                    this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");

                  });
              }
              else {
                this.basicData.sendErrorNotification(errorMsg);
              }
            })
            console.log('Confirm Okay');
          }
        }
      ],

    });

    alert.present();
  }

  shiftCloseAlert() {
    this.shiftClose();
    console.log("Status" + this.dsmVariables.status)
    this.nextshiftAssign = this.error1;
    // var shiftCloseBeforeTime='10:00:00';
    // var shiftCloseAfterTime='11:00:00';
    if (this.error1 == "You can not fill Totalizer as no other SaleMan is not assigned yet..!!!") {
      this.nextshiftAssign = 0;
    }
    else {
      this.nextshiftAssign = 1;
    }



console.log(this.currentTime+" > shiftcloseBeforTime"+this.shiftCloseBeforeTime+" < shiftclseAfterTime"+this.shiftCloseAfterTime+"flag"+this.flag+" nextshiftAssign"+this.nextshiftAssign+"status"+this.dsmVariables.status)
if (this.currentTime >this.shiftCloseBeforeTime && this.currentTime < this.shiftCloseAfterTime && this.dsmVariables.flag == 0 && this.nextshiftAssign == 1 && this.dsmVariables.status == 2) {
      console.log("shownnextAssign")
      let alert = this.alertCtrl.create({
        message: 'यह पंप बंद करने का समय है कृपया सभी लेन-देन को पूरा करें और अपनी shift को बंद करें',
        //message: 'It\'s pump closing time please complete all transaction & close your shift',
        enableBackdropDismiss: false,
        buttons: [
          {
            text: 'OK',
            role: 'OK',

            handler: () => {
              let flag=1;
              this.storage.set('flag',flag);
            }
          }
        ]
      });
      alert.present();
    }
    console.log(this.currentTime+"shiftcloseBeforTime"+this.shiftCloseBeforeTime+"shiftclseAfterTime"+this.shiftCloseAfterTime+"flag"+this.flag+" nextshiftAssign"+this.nextshiftAssign+"status"+this.dsmVariables.status)
    if (this.currentTime > this.shiftCloseBeforeTime && this.currentTime < this.shiftCloseAfterTime && this.dsmVariables.flag == 0 && this.nextshiftAssign == 0 && this.dsmVariables.status == 2) {
      console.log("shownNOnextAssign")
      let alert = this.alertCtrl.create({
        message: 'यह पंप बंद करने का समय है कृपया सभी लेन-देन को पूरा करें और प्रबंधक को अगली Shift असाइन करने का सुझाव दें। फिर अपनी खुद की शिफ्ट बंद करें',
        //   message: 'It\'s pump closing time please complete all transaction &  suggest Manager to assign next Shift & then close your  shift',
        enableBackdropDismiss: false,
        buttons: [
          {
            text: 'OK',
            role: 'OK',

            handler: () => {
              let flag=1;
              this.storage.set('flag',flag);
            }
          }
        ]
      });
      alert.present();
    }

  }

  shiftClose() {
    if (this.dsmVariables.status == 2 && this.currentTime >= '10:00:00' && this.currentTime <= '11:00:00') {
      console.log("Shift Close Time");
    }

  }

  transform(time: any): any {
    let hour = (time.split(':'))[0]
    let min = (time.split(':'))[1]
    let part = '00';
    min = (min+'').length == 1 ? `0${min}` : min;
    hour = hour < 12 ? parseFloat(hour) + 12 : hour;
    hour = (hour+'').length == 1 ? `0${hour}` : hour;
    return `${hour}:${min}:${part}`
  }

  transform1(time: any): any {
    let hour = (time.split(':'))[0]
    let min = (time.split(':'))[1]
    let part = '00';
    min = (min+'').length == 1 ? `0${min}` : min;
 //   hour = hour < 12 ? parseFloat(hour) + 12 : hour;
    hour = (hour+'').length == 1 ? `0${hour}` : hour;
    return `${hour}:${min}:${part}`
  }

}