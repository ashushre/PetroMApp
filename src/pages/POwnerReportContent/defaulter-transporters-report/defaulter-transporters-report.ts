import { Storage } from '@ionic/storage';
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, App, Platform, LoadingController } from "ionic-angular";
import { Region } from '../../../app/region';
import { ReportsProvider } from '../../../providers/reports/reports';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';



/**
 * Generated class for the DefaulterTransportersReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-defaulter-transporters-report",
  templateUrl: "defaulter-transporters-report.html"
})
export class DefaulterTransportersReportPage {
  public regions: any;
  public stateName: Region[] = [];
  public stateNameList: any;
  public transporterNameList: any;
  public transporter: any;
  empty: boolean;
  public Dtransporter: any;
  public transporterList = [];
  public DtransporterList: any;
  public selectedTransporter: any;
  public regionId: number;
  public transporterId: number;
  public pumpId: number;
  public showEmpty: boolean;
  public showError:boolean;
  public;
  public query1 = '';
  public selectedRegions: any;
  public query = '';
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public loadingCtrl: LoadingController,
    public platform: Platform,
    public appCtrl: App,
    public reportData: ReportsProvider,
    public basicData: BasicDataProvider) {
    let backAction = this.platform.registerBackButtonAction(() => {
      this.navCtrl.setRoot("CreditSalesReportPage");
      backAction();
    }, 1);
  }

  ionViewDidLoad() {
    this.initRegion();
    this.storage.get('pumpId').then((val) => {
      this.pumpId = val;

      this.showList();
      this.showTransporter();
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

  showTransporter() {
    this.reportData.getDefaulterTransporters(this.pumpId)
      .subscribe(res => {
        ;
        this.transporter = res;
        this.transporterNameList = res;
        for (var i = 0; i < res.length; i++) {
          this.transporterList[i] = res[i].transporterName;
        }
      }, err => {
        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      })
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

  showList() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...', enableBackdropDismiss: true,
    });

    loading.present();
    this.reportData.getDefaulterTransporters(this.pumpId).subscribe(res => {
console.log(res)
      loading.dismiss();

      this.DtransporterList = res;
      this.Dtransporter = res;
      if (this.DtransporterList.length == 0) {
        this.showError = true;
      }
      else {
        this.showError = false;
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
        if (this.stateNameList.length === 0) {
          this.empty = true;
        }
        else {
          this.empty = false;
        }
      }
    } else {
      this.stateNameList = [];
    }
  }

  select(item) {
    this.query = '';
    this.selectedRegions = this.regions.filter(name => name.name === item);
    this.regionId = this.selectedRegions[0].id;
    this.DtransporterList = this.Dtransporter.filter(v => v.regionId === this.regionId);
    if (this.DtransporterList.length == 0) {
      this.basicData.sendErrorNotification("No transportere is present in this State Please select Valid State");
    }
  }

  tfilter() {
    if (this.query1 !== "") {
      if (this.query1.length > 1) {
        this.transporterNameList = this.transporterList.filter(function (el) {
          return el.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
        }.bind(this));
        if (this.transporterNameList.length == 0) {
          this.showEmpty = true;
        }
        else {
          this.showEmpty = false;
        }
      }
    } else {
      this.transporterNameList = [];
    }
  }

  tselect(item) {
    this.query1 = '';
    this.selectedTransporter = this.transporter.filter(name => name.transporterName === item);
    this.DtransporterList = this.Dtransporter.filter(v => v.id === this.selectedTransporter[0].id)
    if (this.DtransporterList.length == 0) {
      this.basicData.sendErrorNotification("No Data is present in this transporter Please select Valid Transporter");
    }
  }



  home() {
    this.navCtrl.setRoot("CreditSalesReportPage");
  }
  menuClick() {
    this.basicData.checkPumpCount();
  }
}
