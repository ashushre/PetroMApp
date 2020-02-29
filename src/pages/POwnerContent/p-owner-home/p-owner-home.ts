import { Reports } from './../../../app/reports';
import { Component } from "@angular/core";
import { App, Platform, AlertController,NavController, Loading, LoadingController } from "ionic-angular";
import { Storage } from "@ionic/storage";
import { SalesDataProvider } from '../../../providers/sales-data/sales-data';
import { ReportsProvider } from '../../../providers/reports/reports';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';

@Component({
  selector: "page-p-owner-home",
  templateUrl: "p-owner-home.html"
})
export class POwnerHomePage {

  public loyality = new Reports;
  public overall = new Reports
  public paymode = new Reports;
  public creditl = new Reports;
  public cashl = new Reports;
  public oilstock = new Reports;
  public pumpSummary = new Reports;
  public ShiftList=new Reports;
  public pumpALLData=new Reports;

  overallshow: boolean = false;
  overallhide: boolean = false;
  loyalityShow: boolean = false;
  loyalityHide: boolean = true;
  regularShow: boolean = false;
  regularHide: boolean = true;

  LoaylityDetail: any[] = [];
  oilList: any[] = [];
  machineList:any[]=[];
  creditList: any[] = [];
  cashList: any[] = [];
  RegularDetail: any[] = [];
  PaymodeList: any[] = []
  oilproductId: number;

  public paymodeId: number;
  public productId: number;
  public creditId:number;
  public machineId:number;
  public productIdOver: number;
  public activeCS: number;
  public activeLS: number;

  productList: any;
  selectPaymodeList: any;
  regular: any;
  OverallSummary: any;
  pumpSummaryFilter: any

  public pumpId: string;
  public name: string;

  shownGroup = null;
  outstandingAmount: number;
  DailysaleStock: Reports;
 

  constructor(
    public storage: Storage,
    public salesData: SalesDataProvider,
    public reportData: ReportsProvider,
    public platform: Platform,
    public loadingCtrl:LoadingController,
    public navCtrl:NavController,
    public appCtrl: App,
    public basicData: BasicDataProvider,
    public alertCtrl: AlertController, ) {
    let backAction = this.platform.registerBackButtonAction(() => {
      // omitted;
      let alert = this.alertCtrl.create({
        // title: 'Confirm purchase',
        message: "Do you really want to exit?",
          enableBackdropDismiss: true,
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            handler: () => {
             this.navCtrl.setRoot(POwnerHomePage);
            }
          },
          {
            text: "Ok",
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
    }, 1);
    this.productId = 0;
    this.machineId=0;
    this.productIdOver = 0;
    this.paymodeId = 0;
  }

  ionViewDidLoad() {
    this.storage.get("pumpId").then(val => {
      this.pumpId = val;
      this.allDashboradReport();
      this.showCurrentShift();
      this.getDailySaleStock();
    }),err=>{
      console.log(err);
    };

    this.storage.get("activeCS").then(val => {
      this.activeCS = val;
    },err=>{
      console.log(err);
    });

    this.storage.get("activeLS").then(val => {
      this.activeLS = val;
    },err=>{
      console.log(err);
    });
    this.storage.get("name").then(val => {
      this.name = val;
    },err=>{
      console.log(err);
    });
  }

  toggleGroup(group) {

    if (this.isGroupShown(group)) {
      this.shownGroup = null;
    } else {
      this.shownGroup = group;
    }
  }

  isGroupShown(group) {
    return this.shownGroup === group;
  }

  addRequest() {
   this.navCtrl.setRoot("CashDispensePage");
  }
  showCurrentShift()
  {
    this.reportData.getPumpShifts(this.pumpId,this.machineId).subscribe(
      res => {
        this.ShiftList = res;
        console.log(res);
      },
      err => {
        this.basicData.sendErrorNotification(
          "There is some issue. Please TRY again!!!"
        );
      });
  }
  reportRequest() {
   this.navCtrl.setRoot("PumpReportPage");
  }

  doRefresh(refresher) {
    this.ionViewDidLoad();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }


  selectPaymode(paymodeID) {
    this.paymodeId = paymodeID;
    this.allDashboradReport();
  }
  ProductSelect(productID) {
    this.productId = productID;
    this.allDashboradReport();
  }
  MachineSelect(machineId){
    console.log(machineId);
    this.machineId=machineId;
    this.showCurrentShift();
  }


  home() {
    this.ionViewDidLoad();
    this.shownGroup = null;
  }

  menuClick() {
    this.basicData.checkPumpCount();
  }
  allDashboradReport() {
    let loader = this.loadingCtrl.create({
      content: "loading..."
    });
    loader.present();

    this.reportData.allDashboardReports(this.pumpId, this.productId, this.paymodeId).subscribe(res => {
      console.log(res,res.url);
      this.pumpALLData=res;
      this.machineList=res.getMachineName;
      this.outstandingAmount=res.outstandingAmount;
      if(this.outstandingAmount==null || this.outstandingAmount==undefined || isNaN(this.outstandingAmount)==true)
      {
        this.outstandingAmount=0;
      }
      loader.dismiss();
      this.oilstock = res.getOilStock;
      this.oilList = res.getOilStock.tanks;

 
      this.pumpSummary = res.getOilPurchased;
      this.pumpSummaryFilter = res. getOilPurchased.AllPO;

      this.overall = res.getOverallProductWise;
      this.OverallSummary = res.getOverallProductWise.products;
      console.log(res)
      if (this.OverallSummary.length == 0 || this.OverallSummary == null) {
        this.overallshow = true;
        this.overallhide = false;
      }
      else {
        this.overallshow = false;
        this.overallhide = true;
      }
      if (this.overall.sumAmount == null) {
        this.overall.sumAmount = 0.00;
      }
      if (this.overall.sumQty == null) {
        this.overall.sumQty = 0.00;
      }

      this.regular = res.getRegularSalesDashboard;
      this.RegularDetail = res.getRegularSalesDashboard.sales;
      console.log(res)
      if (this.RegularDetail == null || this.RegularDetail.length == 0) {
        this.regularShow = true;
        this.regularHide = false;
      }
      else {
        this.regularShow = false;
        this.regularHide = true;
      }

      if (this.regular.totalAmount == null) {
        this.regular.totalAmount = 0.00;
      }
      if (this.regular.totalQty == null) {
        this.regular.totalQty = 0.00;
      }


      this.loyality = res.getLoyaltySalesDashboard;
      this.LoaylityDetail = res.getLoyaltySalesDashboard.loyaltySalesList;
      if (this.LoaylityDetail == null) {
        this.loyalityShow = true;
        this.loyalityHide = false;
      }
      else {
        this.loyalityShow = false;
        this.loyalityHide = true;
      }
      if (this.loyality.newDrivers == null) {
        this.loyality.newDrivers = 0.00;
      }
      if (this.loyality.totalDriver == null) {
        this.loyality.totalDriver = 0.00;
      }
      if (this.loyality.visitedDriversCount == null) {
        this.loyality.visitedDriversCount = 0;
      }


      this.paymode = res.getPaymodeWiseSales;
      this.PaymodeList = res.getPaymodeWiseSales.allSales;
      if (this.paymode.totalAmount == null) {
        this.paymode.totalAmount = 0.00;
      }
      if (this.paymode.totalCreditAmount == null) {
        this.paymode.totalCreditAmount = 0.00;
      }
      if (this.paymode.totalLoyaltyAmount == null) {
        this.paymode.totalLoyaltyAmount = 0.00;
      }
      if (this.paymode.totalRegularAmount == null) {
        this.paymode.totalRegularAmount = 0.00;
      }



      this.cashl = res.getCashCreditSalesDashboard;
      this.cashList = res.getCashCreditSalesDashboard.sales;
      
      if (this.creditl.totalCSAmount == null) {
        this.creditl.totalCSAmount = 0.00;
      }
      if (this.creditl.totalCSBillAmount == null) {
        this.creditl.totalCSBillAmount = 0.00;
      }
      if (this.creditl.totalPaymentAmount == null) {
        this.creditl.totalPaymentAmount = 0.00;
      }

      
      this.creditl = res.getFuelCreditSalesDashboard;
      this.creditList = res.getFuelCreditSalesDashboard.sales;
      
      if (this.creditl.totalCSAmount == null) {
        this.creditl.totalCSAmount = 0.00;
      }
      if (this.creditl.totalCSBillAmount == null) {
        this.creditl.totalCSBillAmount = 0.00;
      }
      if (this.creditl.totalPaymentAmount == null) {
        this.creditl.totalPaymentAmount = 0.00;
      }
      this.productList = res.getProductList;
      console.log(this.productList)
      this.selectPaymodeList = res.getPaymodeList;



    let credit=this.creditList;
    let loyalty=this.LoaylityDetail;
    let totalSales=this.OverallSummary;
  //  let regular[];
    // for(var i=0;i<this.OverallSummary.length;i++)
    // {
    //   if(totalSales[i].qty==0)
    //   {
    //     this.RegularDetail[i].qty=0;
    //     this.RegularDetail[i].amount=0;
    //   }
    //   else
    //   {
    //     this.RegularDetail[i].qty=parseInt(totalSales[i].qty)-(parseInt(credit[i].qty)+parseInt(loyalty[i].sumQuantity));
    //     this.RegularDetail[i].amount=parseInt(totalSales[i].amount)-(parseInt(credit[i].amount)+parseInt(loyalty[i].sumAmount));
    //   //  this.transform(this.RegularDetail[i].qty);
      
    //     console.log(this.RegularDetail[i].qty,totalSales[i].qty,credit[i].qty,loyalty[i].sumQuantity)
    //     if(this.RegularDetail[i].qty<0)
    //     {
    //       this.RegularDetail[i].qty=0;
    //       this.RegularDetail[i].amount=0;
    //     }
    //   }

    // }
    // this.regular.totalQty=0;
    // this.regular.totalAmount=0;
    // for(var y=0;y<this.RegularDetail.length;y++)
    // {
    
    //   this.regular.totalQty=this.regular.totalQty+this.RegularDetail[y].qty;
    //   this.regular.totalAmount =this.regular.totalAmount +this.RegularDetail[y].amount;
    // }

  }  
    , err => {
      this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");  
       loader.dismiss();
    });

  }

  getDailySaleStock(){
    this.reportData.getDailySaleStock(this.pumpId).subscribe(res => {
      console.log(res);
      this.DailysaleStock=res;
    });
  }

  openWebpage(url: string) {
    window.open(this.pumpALLData.url,"_system");
         
  }
}


