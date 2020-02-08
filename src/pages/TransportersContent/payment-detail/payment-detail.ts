import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';
import { TransDataProvider } from '../../../providers/trans-data/trans-data';
import { Transporter } from '../../../app/transporter';
import { SalesDataProvider } from '../../../providers/sales-data/sales-data';

/**
 * Generated class for the PaymentDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment-detail',
  templateUrl: 'payment-detail.html',
})
export class PaymentDetailPage {
  AdvancePayment = new Transporter;
  id: number;
  status: number;
  flag:number;
  advancePay:number;
  RemainingAdvanceAmount:number;
  //username:string;
  amount: any;
  pendingAmount: number;
  transporterId: number;
  pumpId: number;
  balance: number;
  totalPaidAmount: number;
  updated_by: any;
  PaymentDetail = new Transporter;
  paymodeList: any[] = [];
  paymentReportList: any[] = [];
  constructor(public navCtrl: NavController,
    public basicData: BasicDataProvider,
    public salesData: SalesDataProvider,
    public storage: Storage,
    public alertCtrl:AlertController,
    public loadingCtrl: LoadingController,
    public transData: TransDataProvider,
    public navParams: NavParams) {
    this.id = this.navParams.get('param');
    this.status = this.navParams.get('param1');
    this.pumpId = this.navParams.get('param2');
    console.log(this.id, this.status)
  }

  ionViewDidLoad() {

    this.showPaymode();
    this.storage.get('username').then((val) => {
      this.updated_by = val;
    }), err => {
      console.log(err);
    };
    this.storage.get('transporterId').then((val) => {
      this.transporterId = val;
      this.showBillDetail();
    }), err => {
      console.log(err);
    };

  }
  menuClick() {
    this.basicData.checkPumpCount();
  }
  showBillDetail() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      enableBackdropDismiss: true,
    });
    loading.present();
    if (this.id !== 0) {
      this.transData.getBillDetails(this.id).subscribe(res => {
        loading.dismiss();
        console.log(res);
        this.PaymentDetail = res.bill;
        this.pendingAmount = res.lastamount;
        this.balance = res.balance;
        this.flag=res.flag;
        this.totalPaidAmount = res.totalamount;
        this.advancePay=res.advancedAmount;
        this.PaymentDetail.creditBillId = res.bill.id;

        // if(this.PaymentDetail.advancedAmount)
        // {
       
    
         if(this.balance>res.advancedAmount)
         {
          this.balance= this.balance-res.advancedAmount;
          this.RemainingAdvanceAmount=0;
          console.log("if")
         }
         else
         {
          this.balance= res.advancedAmount-this.balance;
          this.RemainingAdvanceAmount=this.balance;
              this.balance=0;
              console.log("else")
         }
         if(this.balance==0)
         {
          this.amount=0;
         }
        //  if(this.balance<0)
        //  {
        //    this.RemainingAdvanceAmount=this.balance;
        //    this.balance=0;
        //  }
        //  else
        //  {
        //     this.RemainingAdvanceAmount=0;
        //  }
         console.log(this.balance,res.advancedAmount)
       // }
      }, err => {
        loading.dismiss();
        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      })
    }
    else if (this.id == 0) {
      console.log(this.transporterId, this.pumpId);
      this.transData.getAdvanceBillDetails(this.transporterId, this.pumpId).subscribe(res => {
        loading.dismiss();
        console.log(res,this.balance);
        this.PaymentDetail = res;
      }, err => {
        loading.dismiss();
        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      })
    }
    this.transData.getLastPayments(this.transporterId, this.pumpId).subscribe(res => {
      console.log(res);
      this.paymentReportList = res;

    }, err => {
      //  loading.dismiss();
      this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
    })
  }

  //PayMode Function
  showPaymode() {
    this.salesData.getPayMode()
      .subscribe(res => {
        this.paymodeList = res;
        this.PaymentDetail.payModeId = res[0].id;
      }, err => {

        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      })
  }
  
  selectPaymodeList(id) {
    console.log(id);
    this.PaymentDetail.payModeId = id;
    this.AdvancePayment.payModeId = id;
  }

  //Update Bill
  updateBill() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...', enableBackdropDismiss: true,
    });
    loading.present();
    if (this.PaymentDetail.payModeId == undefined) {
      this.PaymentDetail.payModeId = this.paymodeList[0].id;
    }
    if (this.amount > this.balance) {
      //this.basicData.sendErrorNotification("Please enter valid amount");
      //this.amount = null;
      var sum=this.amount-this.balance;
      loading.dismiss();
      // let alert = this.alertCtrl.create({
      //   message: 'You have Entered amount is more than actual bill do you want to add Rs. '+sum+' it into Advance Amount?',
      //     enableBackdropDismiss: false,
      //   buttons: [
      //     {
      //       text: 'Cancel',
      //       role: 'cancel',
      //       handler: () => {
      //        this.amount=null;
      //       }
      //     },
      //     {
      //       text: 'Ok',
      //       handler: () => {
              this.PaymentDetail.advanced=sum;
             this.payAdvance();
      //       }
      //     }
      //   ]
      // });
      // alert.present();
    }
    else {
      this.payAdvance();
      loading.dismiss();
    }
  }

//Save Advance Bill
  advanceBill() {
    this.AdvancePayment.transporterId = this.transporterId;
    this.AdvancePayment.pumpId = this.pumpId;
    // this.AdvancePayment.payModeId=this.PaymentDetail.payModeId;
    this.AdvancePayment.updated_by = this.updated_by;
    let loading = this.loadingCtrl.create({
      content: 'Please wait...', enableBackdropDismiss: true,
    });
    loading.present();
    if (this.AdvancePayment.payModeId == undefined) {
      this.AdvancePayment.payModeId = this.paymodeList[0].id;
    }
    if (this.amount < 0) {
      this.basicData.sendErrorNotification("Please enter valid amount");
      this.amount = null;
      loading.dismiss();
    }
    else {
     
      this.AdvancePayment.amount=this.amount;
      console.log(this.AdvancePayment);

      this.transData.storeAdvancePayments(this.AdvancePayment).subscribe(res => {
        console.log(res);
        loading.dismiss();
        this.basicData.sendSuccessNotification("Advance Payment Done Successfully");
        this.navCtrl.setRoot("PaymentEntryPage");
      }, err => {

        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
        loading.dismiss();
      })
    }
  }

payAdvance()
{
  let loading = this.loadingCtrl.create({
    content: 'Please wait...', enableBackdropDismiss: true,
  });
  loading.present();
  this.PaymentDetail.amount = this.amount;
  this.PaymentDetail.pumpId = this.pumpId;
  this.PaymentDetail.transporterId = this.transporterId;
  this.PaymentDetail.updated_by = this.updated_by;
  console.log(this.PaymentDetail);
  this.transData.updateBillPayment(this.PaymentDetail).subscribe(res => {
    console.log(res)
    this.basicData.sendSuccessNotification("Payment Entry Done Successfully");
    this.navCtrl.setRoot("PaymentEntryPage");
    loading.dismiss();
  }, err => {

    this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
    loading.dismiss();
  })
}
  home() {
    this.navCtrl.setRoot("PaymentEntryPage");
  }

  doRefresh(refresher) {
    this.ionViewDidLoad();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
}
