import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { DsmHomePage } from '../dsm-home/dsm-home';
import { DSMReports } from '../../../app/DSMReports';
import { DsmReportsProvider } from '../../../providers/dsm-reports/dsm-reports';

@IonicPage()
@Component({
  selector: 'page-sales-list',
  templateUrl: 'sales-list.html',
})
export class SalesListPage {
  searchTerm: string = '';
  searchTerm1: string = '';
  creditor:any;
  loyaltor:any;
public dsm = new DSMReports;
public creditList=new DSMReports;
public loyaltyList=new DSMReports;
public categories: any;
view:boolean;
  totalCreditList: any;
  HSDqty: number;
  MSqty: any;
  amount: any;
  amount1: any;
  MSqty1: any;
  HSDqty1: any;
  cashSum: any;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public storage:Storage,
    public dsmdata:DsmReportsProvider,
    public platform:Platform,) {
    let backAction = this.platform.registerBackButtonAction(() => {
      this.navCtrl.setRoot(DsmHomePage);
       backAction();
     }, 1)
     
    this.categories = "credit";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SalesListPage');
    this.storage.get('empShiftId').then((val) => {
      this.dsm.empShiftId = val;
    },err=>{
      console.log(err);
    });
    this.storage.get('pumpId').then((val) => {
      this.dsm.pumpId = val;
    }),err=>{
      console.log(err);
    };
    this.storage.get('activeCS').then((val) => {
      this.dsm.activeCS = val;
      if(val==1)
      {
        this.showCreditList();
      }
    },err=>{
      console.log(err);
    });
    this.storage.get('activeLS').then((val) => {
      this.dsm.activeLS = val;
      if(val==1)
      {
        this.showLoyaltyList();
      }
    },err=>{
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
    this.navCtrl.setRoot(DsmHomePage);
  }

  PaymentDetailPage(id) {
    this.navCtrl.setRoot("PaymentDetailPage", {
      param: id
    });
  }
  filter() {
    this.creditList.creditSales = this.filterItems(this.searchTerm);
    console.log(this.creditList.creditSales);
    if(this.searchTerm=="")
    {
      this.creditList.creditSales = this.creditor;
    }
  }

  filterItems(searchTerm) {
    return this.creditList.creditSales.filter((item) => {
      return item.regNo.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });

  }

  filter1() {
    this.loyaltyList.loyaltySales = this.filterItems1(this.searchTerm1);
    console.log(this.loyaltyList.loyaltySales);
    if(this.searchTerm1=="")
    {
      this.loyaltyList.loyaltySales = this.loyaltor;
    }
  }

  filterItems1(searchTerm) {
    return this.loyaltyList.loyaltySales.filter((item) => {
      return item.vehicleNo.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });

  }
  

  showCreditList()
  {
this.dsmdata.getShiftCreditSales(this.dsm.pumpId,this.dsm.empShiftId).
subscribe(res=>{
  console.log(res);
 this.creditList.creditSales=res.creditSales;
 this.creditor=res.creditSales;
 this.creditList=res;
 this.totalCreditList=res.totalCreditSales;
 this.HSDqty=this.totalCreditList.HSDqty;
 this.MSqty=this.totalCreditList.MSqty;
 this.amount=this.totalCreditList.amount;
 this.cashSum=this.totalCreditList.cashSum;
 console.log(this.HSDqty)
 if(isNaN(this.amount) || this.amount==undefined || this.amount==null)
 {
  this.amount=0
 }
 if(isNaN(this.HSDqty) || this.HSDqty==undefined || this.HSDqty==null)
 {
  this.HSDqty=0
 }
 if(isNaN(this.MSqty) || this.MSqty==undefined || this.MSqty==null)
 {
  this.MSqty=0
 }
 if(isNaN(this.cashSum) || this.cashSum==undefined || this.cashSum==null)
 {
  this.cashSum=0
 }
//  if(this.creditList.creditSales.length==0)
//  {
//   this.view=false; 
//  }
//  else
//  {
  this.view=true; 
//  }
  
})
  }
  showLoyaltyList()
  {
    this.dsmdata.getShiftLoyaltySales(this.dsm.pumpId,this.dsm.empShiftId).
subscribe(res=>{
  console.log(res);
 this.loyaltyList.loyaltySales=res.loyaltySales;
 this.loyaltyList=res;
 this.loyaltor=res.loyaltySales;
 //this.totalCreditList=res.totalloyaltySales;
 this.HSDqty1=res.totalLoyaltySale.HSDqty;
 this.MSqty1=res.totalLoyaltySale.MSqty;
 this.amount1=res.totalLoyaltySale.amount;
 if(isNaN(this.amount1) || this.amount1==undefined || this.amount1==null)
 {
  this.amount1=0
 }
 if(isNaN(this.HSDqty1) || this.HSDqty1==undefined || this.HSDqty1==null)
 {
  this.HSDqty1=0
 }
 if(isNaN(this.MSqty1) || this.MSqty1==undefined || this.MSqty1==null)
 {
  this.MSqty1=0
 }
 //console.log(typeOf(res.loyaltySales[0].forDate));
//  if(this.creditList.creditSales.length==0)
//  {
//   this.view=false; 
//  }
//  else
//  {
  this.view=true; 
//  }
});
  }
  
   
}
