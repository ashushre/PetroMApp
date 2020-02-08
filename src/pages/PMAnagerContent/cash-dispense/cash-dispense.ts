import { SalesDataProvider } from './../../../providers/sales-data/sales-data';
import { PManagerHomePage } from './../p-manager-home/p-manager-home';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Platform, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DateTime, ToastController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CashDispense } from '../../../app/cash.dispense';
import { CreditSale } from '../../../app/credit.sale';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';

@IonicPage()
@Component({
  selector: 'page-cash-dispense',
  templateUrl: 'cash-dispense.html',
})

export class CashDispensePage {
  public user: FormGroup;
  public payModeId: number;
  public crequest = new CashDispense;
  public fuel: boolean = true;
  public pumpListFilter: any;
  public crequests: CreditSale[];
  public pumpList = [];
  public DSMList: any;
  public nozzleList = [];
  public paymodeList = [];
  public man: any;
  fuelActualAmount: number;
  toFix: any;
  showEmpty: boolean;
  public pumpId: number;
  public username: string;
  public employeeId: number;
  public transporterName: string;
  public fuelRequested: number;
  public cashRequested: number;
  public cashRequest: any;
  public created_at: DateTime;
  public errorMsg;
  transporter: boolean = false;
  public Blanket: string;
  public query = '';
  public currentDate: string = new Date().toLocaleDateString();

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public toast: ToastController,
    public loadingCtrl: LoadingController,
    public appCtrl: App,
    public platform: Platform,
    public basicData: BasicDataProvider,
    public salesData: SalesDataProvider,
    public storage: Storage, ) {
    this.crequest.requestComplete = 'N';
    let backAction = this.platform.registerBackButtonAction(() => {
     this.navCtrl.setRoot(PManagerHomePage);
      backAction();
    }, 1)
    this.user = new FormGroup({
      cashActual: new FormControl({ value: '' }, Validators.compose([Validators.required])),
    });
  }

  ionViewDidLoad() {
    //this.basicData.Loader();
    this.storage.get('pumpId').then((val) => {
      this.pumpId = val;
      this.showRequests();
    },err=>{
      console.log(err);
    });
    this.storage.get('username').then((val) => {
      this.username = val;
    },err=>{
      console.log(err);
    });
  }

  showRequests() {
    var i = 0;
    this.salesData.getRequests(this.pumpId)
      .subscribe(res => {
        this.crequests = res.filter(v => v.status == 2);
        for (i = 0; i < this.crequests.length; i++) {
          this.pumpList[i] = this.crequests[i].regNo;
        }
      }, err => {
        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");  
      });
  }

  onRequestChange(selVal): void {
    this.crequest = this.crequests.find(vehicle => vehicle.regNo = selVal);
    this.transporterName = this.crequest.transporterName;
    this.fuelRequested = this.crequest.fuelRequested;
    this.cashRequested = this.crequest.cashRequested;
    this.created_at = this.crequest.created_at;
  }

  filter() {
    if (this.query !== "") {
      if (this.query.length > 2) {
        this.pumpListFilter = this.pumpList.filter(function (el) {
          return el.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
        }.bind(this));
        if (this.pumpListFilter.length == 0) {
          this.showEmpty = true;
        }
        else {
          this.showEmpty = false;
        }
      }

    } else {
      this.pumpListFilter = [];
    }
  }

  select(item) {
    let loading = this.loadingCtrl.create({
        content: 'Please wait...',         enableBackdropDismiss: true,
    });
    loading.present();
    this.query = item;
    this.crequest.regNo = this.query;
    this.salesData.getManagerRequest(this.pumpId, item)
      .subscribe(res => {
        this.query = '';
        loading.dismiss();
        this.DSMList = res;
        this.transporter = true;
        this.man = res;
        this.crequest.requestId = this.man.id;
        this.crequest.pumpId = this.man.pumpId;
        this.crequest.transporterId = this.man.transporterId;
        this.cashRequest = parseFloat(this.man.cashRequested);
        this.fuelActualAmount = this.man.fuelRequested * this.man.productRate;
        this.toFix = this.fuelActualAmount;
        this.fuelActualAmount = this.toFix.toFixed(0);
        if (this.man.fuelRequested == 0) {
          this.fuel = false;
        }
      }, err => {
        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");  
         loading.dismiss();
      });

  }

  addRequest() {
    let loading = this.loadingCtrl.create({
        content: 'Please wait...',         enableBackdropDismiss: true,
    });
    loading.present();
    if (this.user.valid) {
      if (this.crequest.cashActual > this.cashRequest) {
        this.basicData.sendErrorNotification("Actual cash is greater than requested Cash");
        this.crequest.cashActual = null;
        loading.dismiss();
      }
      else if (this.crequest.cashActual < 0) {
        this.basicData.sendErrorNotification("Enter valid Cash");
        loading.dismiss();
      }
      else {
        this.crequest.updated_by = this.username;
        this.salesData.getCashDispense(this.crequest.requestId, this.crequest)
          .subscribe(res => {
            this.basicData.sendSuccessNotification("Cash Dispensed successfully");
           this.navCtrl.setRoot(PManagerHomePage);
            loading.dismiss();
          }, err => {
            loading.dismiss();
            this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
          })
      }
    }

    else {
      this.user.controls['cashActual'].markAsTouched(); 
      loading.dismiss();
    }
  }
  home() {
   this.navCtrl.setRoot(PManagerHomePage);
  }
  menuClick() {
    this.basicData.checkPumpCount();
  }
}


