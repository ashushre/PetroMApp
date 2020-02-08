import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, App, NavController, NavParams, ToastController, Platform, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TransporterPage } from '../transporter/transporter';
import { PaymentEntry } from '../../../app/paymentEntry';
import { Region } from '../../../app/region';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';
import { CreditDataProvider } from '../../../providers/credit-data/credit-data';
import { SalesDataProvider } from '../../../providers/sales-data/sales-data';
import { TransDataProvider } from '../../../providers/trans-data/trans-data';


/**
 * Generated class for the PaymentEntryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-payment-entry',
  templateUrl: 'payment-entry.html',
})
export class PaymentEntryPage {
  user: FormGroup;
  public payment = new PaymentEntry;
  public paymentDetail = new PaymentEntry();
  public transporterId: number;
  show: boolean;
  showOpening: boolean;
  showBill: boolean;
  showAdvance: boolean;
  currentDate: any;
  public pumpList: any;
  public outStandingAmount: number;
  public creditBills: any;
  public amount: number;
  public categories: any;
  public paymodeList: any;
  //public sample:any;
  public pumpCashList: any[] = [];
  public pumpFuelList: any[] = [];
  public stateNameList: any[];
  public selectedRegions: any[];
  public selectp: boolean = false;
  public stateName: Region[] = [];
  constructor
    (public navCtrl: NavController,
      public navParams: NavParams,
      public storage: Storage,
      public basicData: BasicDataProvider,
      public creditData: CreditDataProvider,
      public salesData: SalesDataProvider,
      public toast: ToastController,
      public platform: Platform,
      public loadingCtrl: LoadingController,
      public appCtrl: App,
      public transData: TransDataProvider
    ) {

    var currentDate1 = new Date();
    //this.currentDate = new Date().toLocaleDateString();
    this.currentDate = new Date().toLocaleDateString();
    this.payment.forDate = new Date().toLocaleDateString();

    this.user = new FormGroup({
      amount: new FormControl('', [Validators.required]),
      paymodeId: new FormControl('', [Validators.required]),
    });


    console.log(this.currentDate, this.payment.forDate);
    let backAction = this.platform.registerBackButtonAction(() => {
      this.navCtrl.setRoot(TransporterPage);
      backAction();
    }, 1)
  }

  ionViewDidLoad() {     //this.basicData.Loader();
    this.payment.payModeId = 1;
    this.storage.get('transporterId').then((val) => {
      this.transporterId = val;
      this.showPumps();
      this.showPaymode();
    }, err => {
      console.log(err);
    });
    this.storage.get('username').then((val) => {
      this.payment.updated_by = val;
    }, err => {
      console.log(err);
    });
  }




  doRefresh(refresher) {
    this.ionViewDidLoad();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }


  home() {
    this.navCtrl.setRoot(TransporterPage);
  }


  menuClick() {
    this.basicData.checkTransCount();
  }


  showPumps() {
    this.transData.getPumpList(this.transporterId)
      .subscribe(res => {
        this.pumpList = res;
      }, err => {
        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      })
  }

  selectPump(value) {
    var cashPendingAmount = 0;
    var fuelPendingAmount = 0;
    this.payment.pumpId = value;
    console.log(this.transporterId);
    this.payment.status = 0;
    this.payment.transporterId = this.transporterId;
    this.transData.getBillDetail(this.payment.pumpId, this.transporterId).subscribe(res => {
      console.log(res);
      if(res.error==undefined || res.error==null)
      {
        this.show=true;
      }
      else{
        this.basicData.sendErrorNotification(res.error)
      }
      this.paymentDetail = res;

  
      // if (this.paymentDetail.pumpTransporter.openingDate == null) {
      //   this.show = false;
      //   this.basicData.sendErrorNotification
      //     ("Sorry, you have not entered Opening Balance. Please contact SkyTechHub to add opening Balance ")
      // }
      // else {

      //   if (this.paymentDetail.cashBill == null) {
      //     cashPendingAmount = 0;
      //   }
      //   else {
      //     cashPendingAmount = parseFloat(this.paymentDetail.cashBill.pendingAmount);
      //     if (cashPendingAmount == null) {
      //       cashPendingAmount = 0;
      //     }
      //   }
      //   if (this.paymentDetail.fuelBill == null) {
      //     fuelPendingAmount = 0;
      //   }
      //   else {
      //     fuelPendingAmount = parseFloat(this.paymentDetail.fuelBill.pendingAmount);
      //     if (fuelPendingAmount == null) {
      //       fuelPendingAmount = 0;
      //     }
      //   }

      //   var cashBill = this.paymentDetail.cashBill;
      //   var fuelBill = this.paymentDetail.fuelBill;
      //   var advancedAmount = this.paymentDetail.pumpTransporter.advancedAmount;
      //   var openingBalance = this.paymentDetail.opening;
      //   var advancedAmount = this.paymentDetail.pumpTransporter.advancedAmount;
      //   var openingDate=this.paymentDetail.pumpTransporter.openingDate;
      //   //openingBalance show
      //   if (fuelBill == null && cashBill == null && openingBalance !== 0 && (advancedAmount == null || advancedAmount == 0)) {
      //     this.showOpening = true;
      //     console.log("hii")
      //     this.payment.billType = 5;//opening
      //     this.payment.creditBillId = 0;
      //     this.payment.billNo = 0;
      //     console.log("hii")
      //   }
      //   else {
      //     this.showOpening = false;
      //     console.log("hii")
      //   }

      //   //Advance show
      //   if (this.showOpening == false && fuelBill == null && cashBill == null) {
      //     this.showAdvance = true;
      //     console.log("hii")
      //   }
      //   else {
      //     this.showAdvance = false;
      //     console.log("hii")
      //   }

      //   //Bill show

      //   //Advance show
      //   if (this.showOpening == false && (fuelBill !== null || cashBill !== null)) {
      //     this.showBill = true;
      //     console.log("hii")
      //   }
      //   else {
      //     this.showBill = false;
      //     console.log("hii", this.showOpening, fuelBill, cashBill)
      //   }

      //   //BillType
      //   if (fuelBill == null && cashBill == null && openingBalance == null && (advancedAmount == null || advancedAmount == 0)) {
      //     this.payment.billType = 5;//opening
      //     this.payment.creditBillId = null;
      //     this.payment.billNo = null;
      //     console.log("hii")
      //   }
      //   else if (fuelBill == null && cashBill == null && advancedAmount !== null && this.showOpening == false) {
      //     this.payment.billType = 4;//Advance
      //     this.payment.creditBillId = 0;
      //     this.payment.billNo = 0;
      //   }
      //   else if (fuelBill !== null && cashBill !== null) {
      //     this.payment.billType = 3;//fuel +cash
      //     this.payment.creditBillId = this.paymentDetail.cashBill.id;
      //     this.payment.billNo = this.paymentDetail.cashBill.billNo;
      //   }
      //   else if (fuelBill !== null && cashBill == null) {
      //     this.payment.billType = 2;//cash
      //     this.payment.creditBillId = this.paymentDetail.fuelBill.id;
      //     this.payment.billNo = this.paymentDetail.fuelBill.billNo;
      //   }
      //   else if (fuelBill == null && cashBill !== null) {
      //     this.payment.billType = 1;//cash
      //     this.payment.creditBillId = this.paymentDetail.cashBill.id;
      //     this.payment.billNo = this.paymentDetail.cashBill.billNo;
      //   }
      //   console.log(this.payment.billType, this.payment.creditBillId);
      //   this.outStandingAmount = cashPendingAmount + fuelPendingAmount;
      //   this.show = true;
      //   console.log(this.outStandingAmount);
      // }
    }, err => {

      this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
    });
  }

  showPaymode() {
    this.salesData.getPayMode()
      .subscribe(res => {
        this.paymodeList = res;
        this.paymentDetail.payModeId = res[0].id;
      }, err => {

        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      })
  }

  selectPaymodeList(id) {
    console.log(id);
    this.paymentDetail.payModeId = id;
    this.payment.payModeId = id;
    //this.AdvancePayment.payModeId = id;
  }

  validateBill() {
    var valid = true;
    let loading = this.loadingCtrl.create({
      content: 'Please wait...', enableBackdropDismiss: true,
    });
    loading.present();
    if (!this.user.valid) {
      console.log("hii")
      this.user.controls['amount'].markAsTouched();
      this.user.controls['paymodeId'].markAsTouched();
      valid = false;
    }
    if (this.payment.amount <= 0) {
      this.basicData.sendErrorNotification("Enter valid amount");
      this.payment.amount = null;
      console.log("hii");
      valid = false;
    }
    if (this.payment.payModeId == 12 && this.payment.chequeDate == null) {
      this.basicData.sendErrorNotification("Please enter Payment Cheque Date");
      console.log("hii")
      valid = false;
    }
    if (this.payment.payModeId == 12 && this.payment.chequeNo == null) {
      this.basicData.sendErrorNotification("Please enter Payment Cheque Number");
      console.log("hii")
      valid = false;
    }
    loading.dismiss();
    return valid;
  }
  saveBill() {
    if (this.validateBill()) {

      this.transData.storePayment(this.payment).subscribe(res => {
        console.log(res);
        this.basicData.sendSuccessNotification("Payment Done successfully");
        this.navCtrl.setRoot(TransporterPage);
      }, err => {
        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!")
      })
    }
  }
}
