import { Storage } from '@ionic/storage';
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, App, Platform, LoadingController } from "ionic-angular";
import { ReportsProvider } from '../../../providers/reports/reports';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';
import { Region } from '../../../app/region';



/**
 * Generated class for the TransporterStateWiseReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-transporter-state-wise-report",
  templateUrl: "transporter-state-wise-report.html"
})
export class TransporterStateWiseReportPage {
  public regions: any;
  public stateName: Region[] = [];
  public stateNameList: any;
  public stateList:any;
  public transporterList: any;
  public state: string;
  vehiclecount: number;
  vehicleLimit: number;
  vehicleUsed: number;
  vehiclecountAll: number;
  vehicleLimitAll: number;
  vehicleUsedAll: number;
  count: number;
  countTransporter:number;
  public regionId: number;
  public pumpId: number;
  public selectedRegions: any;
  public showView: boolean;
  public showViewALl: boolean;
  public categories: any;
  public showEmpty: boolean = false;
  public Statewise:boolean=false;
  public query = '';
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public appCtrl: App,
    public platform: Platform,
    public reportData: ReportsProvider,
    public basicData: BasicDataProvider) {
    let backAction = this.platform.registerBackButtonAction(() => {
      this.navCtrl.setRoot("CreditSalesReportPage");
      backAction();
    }, 1);
    this.categories = "SateWise";
  }

  ionViewDidLoad() {
    this.initRegion();
    this.storage.get('pumpId').then((val) => {
      this.pumpId = val;
      this.AllState();

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
  initRegion() {
    this.basicData.getRegions(101)
      .subscribe(res => {
        this.regions = res;
        for (var i = 0; i < this.regions.length; i++) {
          this.stateName[i] = this.regions[i].name;
        }
      }, err => {
        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      });
  }
  filter() {
    if (this.query !== "") {
      if (this.query.length > 1) {
        this.stateNameList = this.stateName.filter(function (el) {
          return el.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
        }.bind(this));
        if (this.stateNameList.length == 0) {
          this.showEmpty = true;
        }
        else {
          this.showEmpty = false;
        }
      }
    } else {
      this.stateNameList = [];
    }
  }

  select(item) {
    this.state = item;
    this.query = '';
    this.selectedRegions = this.regions.filter(name => name.name === item);
    this.regionId = this.selectedRegions[0].id;
    this.getTransporterDetail();

  }
  getTransporterDetail()
  {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      enableBackdropDismiss: true,
    });
    loading.present();
    this.reportData.getTransporterStatwise(this.pumpId, this.regionId).subscribe(res => {
      console.log(this.regionId)
            loading.dismiss();
            if(this.regionId==0)
            {
              console.log("iff")
              this.stateList = res;
              this.countTransporter = this.stateList.length;
              if (this.stateList.length == 0) {
                this.showEmpty = true;
                this.showViewALl = false;
              }
              else {
                this.showEmpty = false;
                this.showViewALl = true;
              }
              console.log(this.stateList);
              this.vehiclecountAll= 0;
              this.vehicleLimitAll = 0;
              this.vehicleUsedAll = 0;
              for (var i = 0; i < this.stateList.length; i++) {
                this.vehiclecountAll += this.stateList[i].totalVehicles;
                this.vehicleLimitAll += this.stateList[i].creditLimitAllotted;
                if(this.stateList[i].usedCreditLimit>0)
                {
                  this.vehicleUsedAll += this.stateList[i].usedCreditLimit;
                }

                console.log(this.vehiclecountAll);
               
              }
               console.log(this.vehiclecountAll);
            }
            else{
              this.transporterList = res;
              this.count = this.transporterList.length;
              if (this.transporterList.length == 0) {
                this.showEmpty = true;
                this.showView = false;
              }
              else {
                this.showEmpty = false;
                this.showView = true;
              }
              console.log(this.transporterList);
              this.vehiclecount = 0;
              this.vehicleLimit = 0;
              this.vehicleUsed = 0;
              for (var i = 0; i < this.transporterList.length; i++) {
                this.vehiclecount += this.transporterList[i].totalVehicles;
                this.vehicleLimit += this.transporterList[i].creditLimitAllotted;
                if(this.transporterList[i].usedCreditLimit>0)
                {
                  this.vehicleUsed += this.transporterList[i].usedCreditLimit;
                }
               // this.vehicleUsed += this.transporterList[i].usedCreditLimit;
               // console.log(this.vehiclecount, this.transporterList[i].totalVehicles);
              }
            }
          
      
          }, err => {
      
            this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
            loading.dismiss();
          })
  }

  home() {
    this.navCtrl.setRoot("CreditSalesReportPage")
  }
  menuClick() {
    this.basicData.checkPumpCount();
  }
  StateWise()
  {
this.Statewise=true;
  }
  AllState()
  {
    this.Statewise=false;
    this.regionId=0;
    this.getTransporterDetail(); 
  }
}
