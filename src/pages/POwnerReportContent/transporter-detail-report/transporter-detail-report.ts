
import { Storage } from "@ionic/storage";
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, App, Platform, LoadingController } from "ionic-angular";
import { Reports } from '../../../app/reports';
import { ReportsProvider } from '../../../providers/reports/reports';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';



/**
 * Generated class for the TransporterDetailReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-transporter-detail-report",
  templateUrl: "transporter-detail-report.html"
})
export class TransporterDetailReportPage {
  public treport = new Reports();
  public transporter: any;
  public transporterList = [];
  public transporterNameList: any;
  selectedTransporter: any;
  public pumpId: number;
  public query = "";
  public blanketTotal: number;
  public nonblanketTotal: number;
  show: boolean = false;
  showEmpty: boolean;
  cashHide: boolean = true;
  fuelHide: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public appCtrl: App,
    public platform: Platform,
    public basicData: BasicDataProvider,
    public reportsData: ReportsProvider
  ) {
    let backAction = this.platform.registerBackButtonAction(() => {
      this.navCtrl.setRoot("CreditSalesReportPage");
      backAction();
    }, 1);
  }

  ionViewDidLoad() {
    this.storage.get("pumpId").then(val => {
      this.pumpId = val;
      ;
      this.showTransporter();
    }, err => {
      console.log(err);
    });
  }
  showTransporter() {
    this.reportsData.getTransporterList(this.pumpId).subscribe(
      res => {
        ;
        this.transporter = res;
        this.transporterNameList = res;
        for (var i = 0; i < res.length; i++) {
          this.transporterList[i] = res[i].name;
        }
      },
      err => {
        this.basicData.sendErrorNotification(
          "There is some issue. Please TRY again!!!"
        );
      }
    );
  }
  filter() {
    if (this.query !== "") {
      if (this.query.length > 1) {
        this.transporterNameList = this.transporterList.filter(
          function (el) {
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

  select(item) {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...', enableBackdropDismiss: true,
    });
    loading.present();
    // this.state = item;
    this.query = "";
    this.selectedTransporter = this.transporter.filter(
      name => name.name === item
    ); this.treport.transporterId = this.selectedTransporter[0].id;
    this.reportsData.getTransporterDetail(this.treport.transporterId, this.pumpId)
      .subscribe(res => {
        console.log(res);
        this.treport = res;
        loading.dismiss();

        for (var i = 0; i < this.treport.vehicles.length; i++) {
          if (this.treport.vehicles[i].blanket == 0) {
            this.nonblanketTotal = this.treport.vehicles[i].vehicle;

          } else if (this.treport.vehicles[i].blanket == 1) {
            this.blanketTotal = this.treport.vehicles[i].vehicle;

          }
        }
        console.log(this.treport.transporterFuelBill.billNo)
        if (this.treport.transporterFuelBill.billNo == 0) {
          this.fuelHide = false;

        }
        else {
          this.fuelHide = true;
        }
        if (this.treport.transporterCashBill.billNo == 0) {
          this.cashHide = false;

        }
        else {
          this.cashHide = true;
        }
        if (this.blanketTotal == undefined) {
          this.blanketTotal = 0;
        }
        if (this.nonblanketTotal == undefined) {
          this.nonblanketTotal = 0;
        }

        this.show = true;
      }, err => {

        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
        loading.dismiss();
      });

  }

  home() {
    this.navCtrl.setRoot("CreditSalesReportPage");
  }
  menuClick() {
    this.basicData.checkPumpCount();
  }
}
