import { Component } from '@angular/core';
import { IonicPage, App, NavController, NavParams, ToastController, Platform, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';
import { Keyboard } from '@ionic-native/keyboard';
import { DsmHomePage } from '../dsm-home/dsm-home';
import { RegularSale } from '../../../app/regular-sale';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';
import { SalesDataProvider } from '../../../providers/sales-data/sales-data';
import { PumpDataProvider } from '../../../providers/pump-data/pump-data';
import { DSMReports } from '../../../app/DSMReports';


@IonicPage()
@Component({
  selector: 'page-regular-cash',
  templateUrl: 'regular-cash.html',
})
export class RegularCashPage {
  textInput = new FormControl('');
  public regular = new RegularSale;
  public dsm = new DSMReports;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public toast: ToastController,
    public keyboard: Keyboard,
    public storage: Storage,
    public loadingCtrl: LoadingController,
    public appCtrl: App,
    public alertCtrl: AlertController,
    public basicData: BasicDataProvider,
    public platform: Platform,
    public salesData: SalesDataProvider,
    public pumpData: PumpDataProvider) {
    this.dsm.totalCashPayable;
    let backAction = this.platform.registerBackButtonAction(() => {
     this.navCtrl.setRoot(DsmHomePage);
      backAction();
    }, 2)
  }

  ionViewDidLoad() {
    this.getStorageInfo();

  }

  ionViewDidEnter(){
    this.getStorageInfo();
  }

  getStorageInfo() {
    this.storage.get('pumpId').then((val) => {
      this.dsm.pumpId = val;
    },err=>{
      console.log(err);
    });
    this.storage.get('empShiftId').then((val) => {
      this.dsm.empShiftId = val;
    },err=>{
      console.log(err);
    });

    this.storage.get('employeeId').then((val) => {
      this.dsm.employeeId = val;
    },err=>{
      console.log(err);
    });

    this.storage.get('managerId').then((val) => {
      this.dsm.managerId = val;
    },err=>{
      console.log(err);
    });
    this.storage.get('activeCS').then((val) => {
      this.dsm.activeCS = val;
    },err=>{
      console.log(err);
    });
    this.storage.get('activeLS').then((val) => {
      this.dsm.activeLS = val;
    },err=>{
      console.log(err);
    });

    this.storage.get('username').then((val) => {
      this.dsm.username = val;
    },err=>{
      console.log(err);
    });

    this.storage.get('shiftId').then((val) => {
      this.dsm.shiftId = val;
      this.showTotalSales();
      this.showPaymode();
      this.showPaymodeLoyality();
    },err=>{
      console.log(err);
    });
  }

  setListSero() {
    var i;
    this.dsm.payMentList = [];
    for (i = 0; i < this.dsm.payModeList.length; i++) {
      this.dsm.payMentList[i];
    }
  }

  onChangeAmount() {
    var totalAmount = 0;
    var i = 0;
    var count = 0;
    for (i = 0; i < this.dsm.payModeList.length; i++) {

      if (this.dsm.payMentList[i] == undefined || this.dsm.payMentList[i]==null || this.dsm.payMentList[i]=="") {
        console.log("if"+this.dsm.payMentList[i])
      }
      else {
        totalAmount += parseFloat(this.dsm.payMentList[i]);
        count = i;
        console.log("else"+this.dsm.payMentList[i])
      }

    }
    console.log(totalAmount)
    if (this.dsm.regularCash === undefined) {
      this.dsm.regularCash = 0;
    }

    this.dsm.sample = this.dsm.totalBalance - totalAmount;
    console.log(this.dsm.sample,"=",this.dsm.totalBalance,"-",totalAmount)

    if (this.dsm.sample < 0) {
      let alert = this.alertCtrl.create({
        message: 'Enter valid regular entry',
          enableBackdropDismiss: true,
        buttons: [
          {
            text: 'Ok',
            handler: () => {

            }
          }
        ]
      });
      alert.present();

    }

    else {
// if(this.dsm.totalCashPayable==NaN || this.dsm.totalCashPayable==undefined)
// {
//   this.dsm.totalCashPayable=0;
// }
      console.log(this.dsm.balanceAmount,this.dsm.totalCashPayable);
      this.dsm.totalCashPayable = parseFloat(this.dsm.regularCash) + parseFloat(this.dsm.payMentList[0]);
      this.dsm.balanceAmount = this.dsm.totalBalance - totalAmount;
      this.dsm.balanceAmount=  Math.round(this.dsm.balanceAmount);
      console.log(this.dsm.balanceAmount);
    }
   
  }

  onInputTime() {
  }

  showPaymode() {
    this.salesData.getPayMode().subscribe(res => {
      this.dsm.payModeList = res;
      this.setListSero();
    }, err => {

      this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
    });
  }

  showPaymodeLoyality() {
    this.salesData.getPayModeLoyality(this.dsm.pumpId, this.dsm.employeeId, this.dsm.empShiftId, this.dsm.saleType).subscribe(res => {
      this.dsm.loyalitySale = res;
      this.dsm.loySale = res;
      if (this.dsm.loyalitySale.length == 0) {
        this.dsm.loyaltyHide = false;
      }
      else {
        this.dsm.loyaltyHide = true;
      }
      var i = 0;
      for (i = 0; i < this.dsm.loyalitySale.length; i++) {
        if (this.dsm.loyalitySale[i].id == 1) {
          this.dsm.regularCash = this.dsm.loyalitySale[i].totalAmount;
        }
      }

      this.dsm.totalCashPayable = this.dsm.regularCash;
 
    }, err => {

      this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
    });
  }

  showTotalSales() {
    this.salesData.getTotalSales(this.dsm.pumpId, this.dsm.empShiftId, this.dsm.employeeId).subscribe(res => {
     
      this.dsm.totalSales = res;
      this.dsm.total = this.dsm.totalSales.totalAmount;
      this.dsm.credit = this.dsm.totalSales.totalCreditAmount;
      this.dsm.loyality = this.dsm.totalSales.totalLoyaltyAmount;
      this.dsm.managerId = this.dsm.totalSales.managerId;
      this.dsm.totalTesting=this.dsm.totalSales.totalTesting;
      console.log(res,this.dsm.totalSales.totalTesting)
      var totalBalance=this.dsm.total;
      this.dsm.totalBalance = totalBalance - (this.dsm.credit+this.dsm.totalSales.totalTesting)
      this.dsm.balanceAmount = totalBalance - (this.dsm.credit+this.dsm.totalSales.totalTesting)
      this.dsm.pendingAmount = this.dsm.totalSales.pendingAmount;
      this.dsm.balanceAmount=  Math.round(this.dsm.balanceAmount);
      console.log(this.dsm.balanceAmount);
      if (this.dsm.pendingAmount == 0) {
        this.dsm.showPending = false;
      }
      else {
        this.dsm.showPending = true;
      }
      this.dsm.total=Math.round(this.dsm.total);
      this.dsm.credit=Math.round(this.dsm.credit);
      this.dsm.totalTesting=Math.round(this.dsm.totalTesting);

    }, err => {

      this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
    })
  }

  actual(event) {
    this.dsm.cashDifference = this.dsm.totalCashPayable - event;

  }

  submit() {
    (this.dsm.sample);
    if ( 0 >this.dsm.sample) {
      let alert = this.alertCtrl.create({
        message: 'Enter valid Regular Entry',
          enableBackdropDismiss: true,
        buttons: [
          {
            text: 'Ok',
            handler: () => {

            }
          }
        ]
      });

      alert.present();
    }
    else if (this.dsm.cashDifference < 0) {
      let alert = this.alertCtrl.create({
        message: 'Enter valid Cash to be paid',
          enableBackdropDismiss: true,
        buttons: [
          {
            text: 'Ok',
            handler: () => {

            }
          }
        ]
      });
      alert.present();
    }
    else {
      let loading = this.loadingCtrl.create({
          content: 'Please wait...',         enableBackdropDismiss: true,
      });
      loading.present();
      if (this.dsm.balanceAmount == 0) {
        for (var i = 0; i < this.dsm.payMentList.length; i++) {
          this.regular = new RegularSale();
          this.regular.balanceAmount = this.dsm.balanceAmount;
          this.regular.pumpId = this.dsm.pumpId;
          this.regular.empShiftId = this.dsm.empShiftId;
          this.regular.DSMId = this.dsm.employeeId;
          this.regular.managerId = this.dsm.managerId;
          this.regular.payModeId = this.dsm.payModeList[i].id;
          this.dsm.amount = this.dsm.payMentList[i];
          if (this.dsm.amount == undefined) {
            this.regular.amount = null;
          }
          else {
            this.regular.amount = this.dsm.amount;
          }
          this.regular.updated_by = this.dsm.username;
          this.dsm.sampleList[i] = this.regular;
        }
        this.dsm.sampleList=this.dsm.sampleList.filter(v=>v.amount!==null);
        const myObjStr = JSON.stringify(this.dsm.sampleList);
        console.log("Successs",myObjStr);
        this.pumpData.addRegularCash(myObjStr).subscribe(res => {
          this.basicData.sendSuccessNotification("Regular Sale Entry Submitted Successfully");
         this.navCtrl.setRoot(DsmHomePage);
          loading.dismiss();
          let flag=0;
          this.storage.set('flag',flag);
        }, err => {
          this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
          loading.dismiss();
        });
      }
      else {
        loading.dismiss();
        this.basicData.sendErrorNotification("Please pay all Balance Amount");
      }
    }
  }
  home() {
   this.navCtrl.setRoot(DsmHomePage);
  }

}         