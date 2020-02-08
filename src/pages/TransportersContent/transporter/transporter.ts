import { MenuController } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController, App, NavParams, Platform, AlertController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { transporterReport } from '../../../app/transporterReport';
import { TransporterReportProvider } from '../../../providers/transporter-report/transporter-report';
import { SalesDataProvider } from '../../../providers/sales-data/sales-data';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';
import { TransDataProvider } from '../../../providers/trans-data/trans-data';
import { Network } from '@ionic-native/network';


/**
 * Generated class for the TransporterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-transporter',
  templateUrl: 'transporter.html',
})
export class TransporterPage {
  creditLimit = new transporterReport;
  consumed = new transporterReport;
  payment = new transporterReport;
  pending = new transporterReport;
  trans = new transporterReport;
  productsList=new transporterReport;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public toast: ToastController,
    public menuCtrl: MenuController,
    public storage: Storage, public alertCtrl: AlertController,
    public platform: Platform,
    public appCtrl: App,
    public transReport: TransporterReportProvider,
    public saleData: SalesDataProvider,
    public network: Network,
    public basicData: BasicDataProvider,
    public transData: TransDataProvider) {
    let backAction = this.platform.registerBackButtonAction(() => {
      let alert = this.alertCtrl.create({
        message: 'Do you really want to exit?',
          enableBackdropDismiss: false,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
             this.ionViewDidLoad();
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
    },0)
    this.trans.pumpId = 0;

  }

  ionViewDidLoad() {
    this.storage.get('userType').then((val) => {
      this.trans.userType = val;
      if (this.trans.userType == 21)
        this.trans.title = "Transporter";
      else if (this.trans.userType == 22)
        this.trans.title = "Manager";
    },err=>{
      console.log(err);
    });
    this.storage.get('transporterId').then((val) => {
      this.trans.transporterId = val;
      console.log(val);
    this.showRequest();
    this.pump();

    }, err => {
      this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
    });

    this.storage.get('name').then((val) => {
      this.trans.name = val;
      // console.log(val);
    },err=>{
      console.log(err);
    })
  }

  totalRequestSend() {
   this.navCtrl.setRoot('RequestListPage')
  }

  totalPendingSend() {
   this.navCtrl.setRoot('RequestListPage');
  }


  toggleGroup(group) {
    if (this.isGroupShown(group)) {
      this.trans.shownGroup = null;
    } else {
      this.trans.shownGroup = group;
    }
  }

  isGroupShown(group) {
    return this.trans.shownGroup === group;
  }

  addRequest() {
  
      this.navCtrl.setRoot('RequestRaisePage');


  }

  doRefresh(refresher) {
    this.ionViewDidLoad();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
  //To get Pumps List
pump()
  {
this.transData.getTransporterPumpList(this.trans.transporterId).subscribe(
  res => {
    console.log(res)
    this.trans.ProductPumpId=res[0].id;
    this.trans.pumpId=res[0].id;
    this.getTransporterAllFunction();
  });
  }

  //To check any non pending request activated vehicle is present
  showRequest() {
    this.transData.getTransRequests(this.trans.transporterId).subscribe(
      res => {
        this.trans.transRequestList = res;
        this.trans.transRequestList = res.filter(v => v.status !== 4);
        this.trans.transRequestList = this.trans.transRequestList.filter(v => v.status !== 3);
        this.saleData.getVehicles(this.trans.transporterId)
          .subscribe(res => {
            this.trans.vehicles = res.filter(v => v.active == 1);
          });

      }, err => {
        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      });
  }

  selectPump(pumpId) {
    this.trans.pumpId = pumpId;
    console.log(pumpId, this.trans.pumpId)
    this.getTransporterAllFunction();
  }
  selectProductPump(pumpId) {
    this.trans.ProductPumpId = pumpId;
    console.log(pumpId, this.trans.ProductPumpId)
    this.getTransporterAllFunction();
  }

  //All Reports
  getTransporterAllFunction() {
    this.transReport.allRequest(this.trans.transporterId, this.trans.pumpId,this.trans.ProductPumpId, this.trans.vehicleId).subscribe(res => {
      console.log(res);

      this.trans.pumpList = res.getPumpList;
      this.payment = res.getPumpWisePaymentReports;
      this.trans.paymentList = res.getPumpWisePaymentReports.sales;

      this.creditLimit = res.getPumpWiseCreditLimit;

      this.consumed = res.getPumpwiseConsumed;
      this.trans.consumedList = res.getPumpwiseConsumed.sales;

      this.pending = res.getPumpwisePendingRequest;

      this.productsList=res.getProductRatePumpWise;

      this.payment.totPending=Math.round(this.payment.totPending);
      this.payment.totPaid=Math.round(this.payment.totPaid);
      this.payment.totDueAmount=Math.round(this.payment.totDueAmount);

      for(var i=0;i<this.trans.paymentList.length;i++)
      {
        this.trans.paymentList[i].dueAmount=  Math.round(this.trans.paymentList[i].dueAmount);
        this.trans.paymentList[i].paid=  Math.round(this.trans.paymentList[i].paid);
        this.trans.paymentList[i].pending=  Math.round(this.trans.paymentList[i].pending);
      }

    }, err => {

      this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
    })
    // .retryWhen(error => error.delay(2000)) // if an error happens, wait 2 secs and try again
    // .timeout(6000)
  }

  openMenu() {
    this.menuCtrl.open();
  }

  home() {
   this.navCtrl.setRoot(TransporterPage);
    this.trans.shownGroup = null;
  }

  RequestListPage() {
   this.navCtrl.setRoot('RequestListPage');
  }

  menuClick() {
    this.basicData.checkTransCount();
  }

}
