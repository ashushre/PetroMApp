import { Component } from "@angular/core";
import {  App, Platform, AlertController ,NavController} from "ionic-angular";
import { Storage } from "@ionic/storage";
import { BasicDataProvider } from "../../../providers/basic-data/basic-data";
import { PumpDataProvider } from "../../../providers/pump-data/pump-data";
import { ReportsProvider } from "../../../providers/reports/reports";
import { Reports } from "../../../app/reports";


@Component({
  selector: "page-p-manager-home",
  templateUrl: "p-manager-home.html"
})
export class PManagerHomePage {
  public pumpSummary=new Reports;
  public ShiftList=new Reports;
  public transPump=new Reports;
  public pumpSummaryFilter:any[]=[];
  public oilStock = new Reports;
  oilList: any[] = [];
  machineList:any[]=[];
  public shownGroup: null;

  public name: string;

  productId: number;
  machineId: number;
  public activeCS:number;
  public pumpId: number;

  productList:any;

  constructor(
    public storage: Storage,
    public appCtrl: App,
    public platform: Platform,
    public navCtrl:NavController,
    public reportData:ReportsProvider,
    public basicData: BasicDataProvider,
    public alertCtrl: AlertController,
    public pumpData: PumpDataProvider,
  ) 
  {
    let backAction = this.platform.registerBackButtonAction(() => {
      let alert = this.alertCtrl.create({
        message: "Do you really want to exit?",
          enableBackdropDismiss: true,
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            handler: () => {
             this.navCtrl.setRoot(PManagerHomePage);
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
    this.productId=0;
    this.machineId=0;
  }

  ionViewDidLoad() {
    this.storage.get("activeCS").then(val => {
      this.activeCS = val;
    },err=>{
      console.log(err);
    });
  
    this.storage.get("pumpId").then(val => {
      this.pumpId = val;
      this.showProduct();
      this.showPumpSummary();
     // this.showCurrentShift();
      this.showOilStock();
      this.getMachine();
      this.pumpData.getPumpTotal(this.pumpId).subscribe(
        res => {
          this.transPump = res;
        },
        err => {
          this.basicData.sendErrorNotification(
            "There is some issue. Please TRY again!!!"
          );
        }
      );
    },err=>{
      console.log(err);
    });

    this.storage.get("name").then(val => {
      this.name = val;
    },err=>{
      console.log(err);
    });
  }


  showOilStock() {
    this.reportData.getOilStock(this.pumpId,this.productId).subscribe(res => {
     // this.oilStock=res;
     console.log(res)
      this.oilStock = res;
      this.oilList = res.tanks;
      // this.oilstock = res.getOilStock;
      // this.oilList = res.getOilStock.tanks;
    }, err => {
      this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");  
    })
  }

  showPumpSummary() {
    this.reportData.getOilPurchased(this.pumpId, this.productId).subscribe(res => {
      console.log(res)
      this.pumpSummary = res;
      this.pumpSummaryFilter = res.AllPO;
    }
    , err => {
      this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");  
    })
  }

  ProductSelect(productID) {
    this.productId = productID;
    this.showPumpSummary();
    this.showOilStock();
  }
  MachineSelect(machineId){
    console.log(machineId);
    this.machineId=machineId;
    this.showCurrentShift();
  }

  showProduct() {
    this.reportData.getProductList(this.pumpId).subscribe(
      res => {
        this.productList = res;
      },
      err => {
        this.basicData.sendErrorNotification(
          "There is some issue. Please TRY again!!!"
        );
      });
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

  getMachine()
  {
    this.reportData.getMachine(this.pumpId).subscribe(
      res => {
        this.machineList = res;
        console.log(res);
       // this.machineId=res[0].id;
        this.showCurrentShift();
      },
      err => {
        this.basicData.sendErrorNotification(
          "There is some issue. Please TRY again!!!"
        );
      });
  }
  doRefresh(refresher) {
    this.ionViewDidLoad();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
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

  home() {
    this.ionViewDidLoad();
    this.shownGroup=null;
  }

  menuClick() {
    this.basicData.checkPumpCount();
  }

  addRequest() {
   this.navCtrl.setRoot("CashDispensePage");
  }

  reportRequest() {
   this.navCtrl.setRoot("PumpReportPage");
  }

}
