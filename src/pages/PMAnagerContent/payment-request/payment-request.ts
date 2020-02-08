import { PManagerHomePage } from './../p-manager-home/p-manager-home';
import { Component } from '@angular/core';
import { IonicPage, App, NavController, NavParams, Platform, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { PaymentReminder } from '../../../app/paymentReminder';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';
import { CreditDataProvider } from '../../../providers/credit-data/credit-data';
import { SalesDataProvider } from '../../../providers/sales-data/sales-data';
import { POwnerHomePage } from '../../POwnerContent/p-owner-home/p-owner-home';
/**
 * Generated class for the PaymentRequestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment-request',
  templateUrl: 'payment-request.html',
})
export class PaymentRequestPage {
  public msgToSend: string;
  public allRequest: PaymentReminder[];
  public sendRequestList = new PaymentReminder;
  public selAmount: number;
  public userType: number;
  public transporterId: number;
  public selMobileNos: string[];
  SelectAll = true;
  productId:number;
  total: number = 0;
  transporterName: any;
  pumpMobileNo: number;
  creditLimit: number;
  public pumpId: number;
  public msgId: number;
  public trans: any[];
  public errorMsg: string;
  public show: boolean = false;
  public hide: boolean = false;
  public sale: any[] = [];
  public phonenumbers: any = []; //Array for sending sms to numbers
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public platform: Platform,
    public appCtrl: App,
    public loadingCtrl: LoadingController,
    public basicData: BasicDataProvider,
    public creditData: CreditDataProvider,
    public salesData: SalesDataProvider) {

    let backAction = this.platform.registerBackButtonAction(() => {
      this.navCtrl.setRoot(POwnerHomePage);
      backAction();
    }, 1)
  }

  ionViewDidLoad() {     //this.basicData.Loader();
    this.storage.get('pumpId').then((val) => {
      this.pumpId = val;
      this.showTransporters();
    }, err => {
      this.errorMsg = err;
      this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
    });
    this.storage.get('userType').then((val) => {
      this.userType = val;
    },err=>{
      console.log(err);
    });

  }
  ssign() {
    var i;
    this.trans = [];
    for (i = 0; i < this.allRequest.length; i++) {
      this.trans[i] = 0;
    }

  }
  sendRequest() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...', enableBackdropDismiss: true,
    });
    loading.present();
    var i = 0;
    for (i = 0; i < this.allRequest.length; i++) {
      this.sendRequestList = new PaymentReminder;
      this.sendRequestList.pumpId = this.pumpId;
      this.sendRequestList.message = this.msgToSend;
      this.sendRequestList.transporterId = this.allRequest[i].transporterId;
      if (this.sendRequestList.transporterId !== false) {
        this.sale[i] = this.sendRequestList;
      }

    }

    const myObjStr = JSON.stringify(this.sale);
    this.creditData.sendPaymentReminder(myObjStr).subscribe(res => {
      this.basicData.sendSuccessNotification("Payment Reminder Sent Successfully");
      loading.dismiss();
      this.navCtrl.setRoot(PManagerHomePage);
    }, err => {
      this.errorMsg = err;
      loading.dismiss();
      this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
    });
  }

  showTransporters() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      enableBackdropDismiss: true,
    });
    loading.present();
    this.creditData.getPaymentReminder(this.pumpId)
      .subscribe(res => {
        this.allRequest = res;
        loading.dismiss();
        this.ssign();
        if (this.allRequest.length == 0) {
          this.hide = true;
          this.show = true;
        }
        else {
          this.hide = false;
          this.show = true;
        }
      }, err => {
        loading.dismiss();
        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      });
  }

  // onChangeAmount() {
  //   this.sale = this.allRequest.filter(
  //     rem => rem.transporterId >= this.transporterId);
  // }

  // selChanged(transporter) {
  //   this.sale = this.allRequest.filter(
  //     rem => rem.transporterId >= this.transporterId);
  // }

  onCheckboxChange(option, event) {
    if (event.target.checked) {
      this.sale.push(option.id);
    } else {
      for (var i = 0; i < this.allRequest.length; i++) {
        if (this.sale[i] == option.id) {
          this.sale.splice(i, 1);
        }
      }
    }
  }

  doRefresh(refresher) {
    this.ionViewDidLoad();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
  home() {
    if (this.userType == 11) {
      this.navCtrl.setRoot(POwnerHomePage)
    }
    else if (this.userType == 12) {
      this.navCtrl.setRoot(PManagerHomePage)
    }
  }

  menuClick() {
    this.basicData.checkPumpCount();
  }
  ProductSelect(id) {
    this.msgId = id;
    switch (id) {
      case '1':
        if (this.total == 1) {
          this.msgToSend = "Greetings from " + this.allRequest[0].pumpName + ". Dear " + this.transporterName + " your dues are Rs." + this.creditLimit + "/- .Please Pay urgently to continue using our services. Ph:" + this.pumpMobileNo;
        }
        if (this.total > 1 || this.total == 0) {
          this.pumpMobileNo = this.allRequest[0].pumpMobileNo;
          this.msgToSend = "Greetings from " + this.allRequest[0].pumpName + " .Your Bill is generated and due.Please Pay urgently to continue using our services. Ph:" + this.pumpMobileNo;
        }
        break;
      case '2':
        this.msgToSend = null;
        break;

    }
  }

  selectTransporter(e: any) {
    console.log(e.checked)
    for (var i = 0; i < this.allRequest.length; i++) {
      if (e.checked == true) {
        this.allRequest[i].transporterId = true;
      }
      else {
        this.msgToSend = null;
        this.productId=2;
        this.allRequest[i].transporterId = false;
      }
    }
  }
  transChange(e: any) {
    this.total = 0;
    if (e.checked == false) {
      this.SelectAll = false;
    }
    for (var i = 0; i < this.allRequest.length; i++) {
      if (this.allRequest[i].transporterId == true) {
        this.total = this.total + 1;
        if (this.total == 1) {
          this.transporterName = this.allRequest[i].transporterName;
          this.pumpMobileNo = this.allRequest[i].pumpMobileNo;
          this.creditLimit = this.allRequest[i].billAmount * 100000;
        }
      }
    }
    console.log(this.total);
  }
}
