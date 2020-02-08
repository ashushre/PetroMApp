import { Component } from '@angular/core';
import { IonicPage, App, NavController, NavParams, Platform, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TransporterPage } from '../transporter/transporter';
import { Vehicle } from '../../../app/vehicle';
import { SalesDataProvider } from '../../../providers/sales-data/sales-data';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';
import { TransDataProvider } from '../../../providers/trans-data/trans-data';

/**
 * Generated class for the VehicleListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vehicle-list',
  templateUrl: 'vehicle-list.html',
})
export class VehicleListPage {
  public pumpId: any;
  vehicleList: any[] = [];
  //pumpList1: any[] = [];
  searchTerm: string = '';
  searchTerm1: string = '';
  searchTerm2: string = '';
  public transporterId: any;
  public vehicle = new Vehicle;
  public vehicles = [];
  public deacVehicle = [];
  public errorMsg;
  public show: boolean = false;
  public hide: boolean = true;
  public view: boolean = true;
  public nonview: boolean = false;
  public categories = "active";
  public active: number;
  public deactive: number;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public appCtrl: App,
    public loadingCtrl:LoadingController,
    public saleData: SalesDataProvider,
    public platform: Platform,
    public basicData: BasicDataProvider,
    public transData: TransDataProvider) {

    let backAction = this.platform.registerBackButtonAction(() => {
     this.navCtrl.setRoot(TransporterPage);
      backAction();
    }, 1)
  }

  ionViewDidLoad() {
    this.storage.get('pumpId').then((val) => {
      this.pumpId = val;
    },err=>{
      console.log(err);
    });
    let id = this.navParams.get('id');
    if (id == "deact") {
      this.categories = "deactive";
    }
    else if (id == undefined || id == null) {
      this.categories = "active";
    }
    this.storage.get('transporterId').then((val) => {
      this.transporterId = val;
      this.getVehicles();
    },err=>{
      console.log(err);
    });

  }

  filter() {
    this.deacVehicle = this.filterItems(this.searchTerm);
    console.log(this.deacVehicle);
    if(this.searchTerm=="")
    {
      this.deacVehicle = this.vehicleList.filter(v => v.active == 0);
    }
  }

  filterItems(searchTerm) {
    return this.deacVehicle.filter((item) => {
      return item.regNo.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });

  }

  filter1() {
    this.vehicles = this.filterItems1(this.searchTerm1);
    console.log(this.vehicles);
    if(this.searchTerm1=="")
    {
      this.vehicles = this.vehicleList.filter(v => v.active == 1);
    }
  }

  filterItems1(searchTerm) {
    return this.vehicleList.filter((item) => {
      return item.regNo.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });

  }
  getVehicles() {
    let loading = this.loadingCtrl.create({
        content: 'Please wait...',         enableBackdropDismiss: true,
    });
    loading.present();
    this.saleData.getVehicles(this.transporterId)
      .subscribe(res => {
        loading.dismiss();
        this.vehicleList=res;
        this.vehicles = res.filter(v => v.active == 1);
        this.deacVehicle = res.filter(v => v.active == 0);
           ;
        this.active = this.vehicles.length;
        this.deactive = this.deacVehicle.length;
        if (this.deacVehicle.length == 0) {
          this.show = true;
          this.hide = false;
        }
        if (this.vehicles.length == 0) {
          this.nonview = true;
          this.view = false;
        }
        // else{
        //   this.view=true;
        //   this.nonview=false;
        // }
      }, err => {
        this.errorMsg = err;
        loading.dismiss();
        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      });
  }

  addVehicle() {
   this.navCtrl.setRoot("VehicleAddPage");
  }

  editVehicle(id) {
    //console.log("id: "+id);
   this.navCtrl.setRoot("VehicleEditPage", { 'id': id });
  }

  deleteVehicle(id) {

  }

  viewVehicle(id) {
   this.navCtrl.setRoot('VehicleDeactivatePage', {
      param1: id
    });

  }
  doRefresh(refresher) {
    this.ionViewDidLoad();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
  home() {
   this.navCtrl.setRoot(TransporterPage);
  }
  menuClick() {
    this.basicData.checkTransCount();
  }
}
