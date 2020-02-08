
import { PManagerHomePage } from './../p-manager-home/p-manager-home';
import { Component } from '@angular/core';
import { IonicPage, App, NavController, NavParams, ToastController, Platform, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Time, DatePipe } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Product } from '../../../app/product';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';
import { PumpDataProvider } from '../../../providers/pump-data/pump-data';
import { POwnerHomePage } from '../../POwnerContent/p-owner-home/p-owner-home';
import { ReportsProvider } from '../../../providers/reports/reports';
/**
 * Generated class for the ProductRatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-product-rate',
  templateUrl: 'product-rate.html',
})
export class ProductRatePage {
  user: FormGroup;
  public productId:number=1;
  public products: Product[];
  public product = new Product;
  public effectiveDate: Date;
  currentDate: any;
  currentTime: any;
  public effectiveTime: Time;
  public currentRate: number;
  public productName: string;
  public pumpId: number;
  productsList:any;
  oldProductList:any[]=[];
  public driverId: number;
  public errorMsg;
  start: Date;
  public productSuccess: any;
  public username: string;
  public userType: number;
  public i: any;
  start1: Date;
  tDate: any;
  eDate: any;
  sDate: any;
  startDate: any;
  show: boolean = false;
  view: boolean = false;
  endDate: any;
  constructor(public navCtrl: NavController,
    public toast: ToastController,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public appCtrl: App,
    public datepipe: DatePipe,
    public reportData:ReportsProvider,
    public basicData: BasicDataProvider,
    public storage: Storage, public navParams: NavParams,
    public pumpData: PumpDataProvider) {
    let backAction = this.platform.registerBackButtonAction(() => {
      if (this.userType == 11) {
       this.navCtrl.setRoot(POwnerHomePage)
      }
      else if (this.userType == 12) {
       this.navCtrl.setRoot(PManagerHomePage)
      }
      backAction();
    }, 1)
    this.currentDate = new Date().toLocaleDateString();
    this.currentTime = new Date().toLocaleTimeString();
    console.log(this.currentDate,this.currentTime);
    console.log(this.currentDate,this.currentTime);
    if(this.currentTime >'06:00:00:AM')
    {
      var currentDate1 = new Date();
        currentDate1.setDate(currentDate1.getDate() + 1);
      this.start = currentDate1;
      this.currentDate = this.start.toLocaleDateString();

    }
  

  }

  ionViewDidLoad() {     //this.basicData.Loader();
    this.storage.get('pumpId').then((val) => {
      this.pumpId = val;
      this.endDate = new Date().toISOString();
      var currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - 6);
      this.start1 = currentDate;
      this.startDate = this.start1;
      console.log(this.startDate,this.endDate)
      this.showProducts();
    
    },err=>{  
      console.log(err);
    });
    this.storage.get('username').then((val) => {
      this.username = val;
    },err=>{
      console.log(err);
    });
    this.storage.get('userType').then((val) => {  
      this.userType = val;
    },err=>{
      console.log(err);
    });
  }

  showProducts() {
    
    this.pumpData.getProducts(this.pumpId)
      .subscribe(res => {
        // this.products = res.filter(product => product.category=='Fuel');;
        console.log(res)
        this.products = res.prodrates;
        this.productsList=res.prodrates;
        this.productId=this.productsList[0].productId;
        this.currentTime=res.rateTime;
  
        this.effectiveTime=res.rateTime;
       //this.effectiveTime = this.datepipe.transform(this.effectiveTime, "hh:mm");
        this.showOldProduct();
        
      }, err => {

        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      });
  }

  addProductRate() {
    let loading = this.loadingCtrl.create({
        content: 'Please wait...',         enableBackdropDismiss: true,
    });
    loading.present();
console.log(this.effectiveDate,this.effectiveTime)
      if (this.effectiveDate == undefined || this.effectiveTime == undefined) {
        this.basicData.sendErrorNotification("Please add effective Date and time");
        loading.dismiss();
      }
      else {
        for (this.i = 0; this.i < this.products.length; this.i++) {
          if (this.products[this.i].newRate == undefined) {
            this.products[this.i].newRate = this.products[this.i].currentRate;
          }
          else {
            this.products[this.i].newRate = this.products[this.i].newRate;
          }

          this.products[this.i].updated_by = this.username;
          this.products[this.i].effectiveDate = this.effectiveDate;
          this.products[this.i].effectiveTime = this.effectiveTime;

        }

        const myObjStr = JSON.stringify(this.products);
        console.log(myObjStr);
        this.pumpData.addProductRate(myObjStr, this.pumpId).subscribe(res => {
          this.productSuccess = JSON.stringify(res);
          var error = JSON.parse(this.productSuccess).errors;
          if (error == undefined || error == null) {
            this.basicData.sendSuccessNotification("Rates Changed successfully,will be effective from next cycle");
            loading.dismiss();
            if (this.userType == 11) {
             this.navCtrl.setRoot(POwnerHomePage)
            }
            else if (this.userType == 12) {
             this.navCtrl.setRoot(PManagerHomePage)
            }
          }
          else {
            this.basicData.sendErrorNotification("" + error);
           // this.effectiveTime = null;
            loading.dismiss();
          }
        }, err => {
          this.errorMsg = err;
          this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
          loading.dismiss();
        })
      }
    }
  

  public onProductChange(selVal): void {
    this.product = this.products.find(p => p.id == selVal);
    this.showOldProduct();
    // this.currentRate = this.product.  this.endDate = new Date().toISOString();
    // var currentDate = new Date();
    // currentDate.setDate(currentDate.getDate() - 6);
    // this.start1 = currentDate;
    // this.startDate = this.start1;
  }

  trackByIndex(index: number, value: number) {
    return index;
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

  showOldProduct()
  {    let loading = this.loadingCtrl.create({
      content: 'Please wait...',         enableBackdropDismiss: true,
  });
  loading.present();
  this.endDate = this.datepipe.transform(this.endDate, "yyyy-MM-dd");
  this.startDate = this.datepipe.transform(this.startDate, "yyyy-MM-dd");
console.log(this.startDate,this.endDate)
    this.reportData.getOldProductRates(this.pumpId,this.productId,this.startDate,this.endDate).subscribe(res=>{
      loading.dismiss();
      console.log(res)
      this.oldProductList=res;
    }, err => {
      this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");  
       loading.dismiss();
    });
  }
  ProductSelect(value){
    this.productId=value;
   this.showOldProduct();
  }

  onChange(value) {
    switch (value) {
      case '1':
        this.startDate = new Date().toISOString();
        this.endDate = new Date().toISOString();
        this.showOldProduct();
        this.show = false;
        break;

      case '2':
        var currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 1);
        this.start1 = currentDate;
        this.startDate = this.start1.toISOString();
        this.endDate = this.startDate;
        this.showOldProduct();
        this.show = false;
        break;
      case '3':
        currentDate = new Date();
        this.endDate = new Date().toISOString();
        currentDate.setDate(currentDate.getDate() - 2);
        this.start1 = currentDate;
        this.startDate = this.start1.toISOString();
        this.showOldProduct();
        this.show = false;
        break;
      case '4':
        currentDate = new Date();
        this.endDate = new Date().toISOString();
        currentDate.setDate(currentDate.getDate() - 6);
        this.start1 = currentDate;
        this.startDate = this.start1.toISOString();
        this.showOldProduct();
        this.show = false;
        break;
      case '5':
        currentDate = new Date();
        this.endDate = new Date().toISOString();
        currentDate.setDate(currentDate.getDate() - 14);
        this.start1 = currentDate;
        this.startDate = this.start1.toISOString();
        this.showOldProduct();
        this.show = false;
        break;
      case '6':
        currentDate = new Date();
        this.endDate = new Date().toISOString();
        currentDate.setDate(1);
        this.start1 = currentDate;
        this.startDate = this.start1.toISOString();
        this.showOldProduct();
        this.show = false;
        break;
      case '7':
        currentDate = new Date();

        currentDate.setDate(1);
        var currentMonth = currentDate.getMonth() - 1;
        currentDate.setMonth(currentMonth);
        this.start1 = currentDate;
        this.startDate = this.start1.toISOString();
        // var currentDate = new Date();
        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        var lastDay = new Date(y, m, 0);
        this.start1 = lastDay;
        this.endDate = this.start1.toISOString();
        this.showOldProduct();
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
      this.showOldProduct();
    }

  }
}
