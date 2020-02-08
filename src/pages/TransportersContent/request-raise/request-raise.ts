import { Component } from '@angular/core';
import { IonicPage, App, NavController, NavParams, ToastController, AlertController, Platform, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { TransporterPage } from '../transporter/transporter';
import { CreditSale } from '../../../app/credit.sale';
import { Vehicle } from '../../../app/vehicle';
import { Region } from '../../../app/region';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';
import { TransDataProvider } from '../../../providers/trans-data/trans-data';
import { SalesDataProvider } from '../../../providers/sales-data/sales-data';


@IonicPage()
@Component({
  selector: 'page-request-raise',
  templateUrl: 'request-raise.html',
})
export class RequestRaisePage {
  user: FormGroup;
  public crequest = new CreditSale;
  public vehicles: Vehicle[];
  public stateName: Region[] = [];

  public stateNameList: any;
  public selectedRegions: any;
  public vehicleNameList: any;
  public vehicleName:Vehicle[]=[];

  public showEmpty: boolean;
  public showEmptyVehicle: boolean;
  public showValue:boolean;

  public state: any;
  public PumppumpList: any;
  public error: any;
  public pumpList: any;
  public productList: any;
  public fuelList: any;
  
  public regions: any;
  public balanceLimit:String;
  public unitName: string;
  public transRequestList: any;
  public show: boolean = false;
  public query = '';
  public queryVehicle = '';
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public appCtrl: App,
    public toast: ToastController,
    public alert: AlertController,
    public loadingCtrl: LoadingController,
    public basicData: BasicDataProvider,
    public platform: Platform,
    public transData: TransDataProvider,
    public salesData: SalesDataProvider) {

    this.crequest.unitName = "₹";
    this.crequest.requestType = 2;

    let backAction = this.platform.registerBackButtonAction(() => {
     this.navCtrl.setRoot(TransporterPage);
      backAction();
    }, 1)

    this.user = new FormGroup({
      vehicle: new FormControl('', [Validators.required]),
      pump: new FormControl('', [Validators.required]),
    });
  }
  ionViewDidLoad() {
    this.storage.get('transporterId').then((val) => {
      this.crequest.transporterId = val;
      this.showPumps();
      this.showFuel();
      this.initRegion();
      this.showRequest();

    },err=>{
      console.log(err);
    });

    this.storage.get('username').then((val) => {
      this.crequest.updated_by = val;
    },err=>{
      console.log(err);
    });
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
    this.selectedRegions = this.regions.filter(name => name.name === this.state);
    this.crequest.regionId = this.selectedRegions[0].id;
    this.pumpList = this.pumpList.filter(regionId => regionId.regionId == this.selectedRegions[0].id);
    if (this.pumpList.length == 0) {
      let alert = this.alert.create({
        title: 'Sorry no pumps are present for this state',
          enableBackdropDismiss: true,
        buttons: ['Ok']
      });
      alert.present();
      this.pumpList = this.PumppumpList;
      this.state = '';
    }
    else {
      this.show = true;
    }
  }

  showVehicles() {
    this.salesData.getVehicles(this.crequest.transporterId)
      .subscribe(res => {
        this.vehicles = res.filter(vehicle => vehicle.blanket == 0);
        this.vehicles = this.vehicles.filter(vehicle => vehicle.active == 1);
         for (var i = 0; i < this.transRequestList.length; i++) {
           this.vehicles = this.vehicles.filter(vehicle => vehicle.regNo!==this.transRequestList[i].regNo);
         }
        if (this.vehicles.length == 0) {
          this.basicData.sendErrorNotification("Sorry No vehicles for this pump are present to raise request");

         this.navCtrl.setRoot('RequestListPage');
        }
        for (var i = 0; i < this.vehicles.length; i++) {
          this.vehicleName[i] = this.vehicles[i].regNo;
        }
        console.log(this.vehicleName);
       
      }, err => {
        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      });
  }

 
  filterVehicle() {
    if (this.crequest.pumpId == undefined || this.crequest.pumpId == null) {
      this.queryVehicle ='';
      let alert = this.alert.create({
        title: 'Please select first Pump',
          enableBackdropDismiss: true,
        buttons: ['Ok']
      }); 
      alert.present();
    }
    else {
      this.showValue=true;
    if (this.queryVehicle !== "") {

      if (this.queryVehicle.length > 1) {
        console.log(this.vehicleName,this.vehicleNameList,)
        this.vehicleNameList = this.vehicleName.filter(function (el) {
          return el.toLowerCase().indexOf(this.queryVehicle.toLowerCase()) > -1;
        }.bind(this));
        if (this.vehicleNameList.length == 0) {
          this.showEmptyVehicle = true;
        }
        else {
          this.showEmptyVehicle = false;
        }
      }
    } else {
      this.vehicleNameList = [];
    }
  }
  }

  selectVeh(item) {
    this.queryVehicle = item;
    this.showValue=false;

    let selectedVehicle= this.vehicles.filter(reg => reg.regNo === item);
   console.log(selectedVehicle[0]);
    this.crequest.regNo=item;
    var prodGroupId = selectedVehicle[0].prodGroupId;
    this.unitName = selectedVehicle[0].unitName;
   // this.capacity = selectedVehicle[0].capacity;
   var fuelName=selectedVehicle[0].fuelName;
    this.crequest.capacity=selectedVehicle[0].capacity;
    this.productList = this.fuelList.filter(pump => pump.pumpId == this.crequest.pumpId);
    this.productList = this.productList.filter(vehicle => vehicle.prodGroupId == prodGroupId);
    if (this.productList.length == 0) {
      this.basicData.sendErrorNotification("Sorry the pump  doen't conatins "+fuelName+" fuel type");

    }
    else {
      this.crequest.productId = this.productList[0].productId;
    }

  }

  showPumps() {
    this.transData.getPumpList(this.crequest.transporterId)
      .subscribe(res => {
        this.pumpList = res;
        this.PumppumpList = res;
        if(this.pumpList.length==0)
        {
          this.basicData.sendErrorNotification("Sorry..!!! no pumps present to raise request");
         this.navCtrl.setRoot('RequestListPage');
        }

      }, err => {
        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      })
  }

  showFuel() {
    this.transData.getFuel(this.crequest.transporterId)
      .subscribe(res => {
        this.fuelList = res;
        if (this.fuelList.length == 0) {
          this.basicData.sendErrorNotification("Please select valid vehicle and its respective pump");
          this.showPumps();
        }
      }, err => {
        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      })
  }


  public selectPump(selVal1): void {
    this.crequest.pumpId = selVal1.pumpId;
    this.crequest.fuelCash=selVal1.fuelCash;
    this.pumpList = this.PumppumpList;
    this.balanceLimit=selVal1.creditLimitBalance;
    this.transRequestList = this.transRequestList.filter(v => v.pumpId== selVal1.pumpId);
console.log(selVal1);
    this.showVehicles();

    if(selVal1.defaulter==1){
      this.basicData.sendErrorNotification("Your payment is already due for this pump please pay to raise request for this pump");
     this.navCtrl.setRoot('RequestListPage');
    }

  }


  public onChange3(selVal3): void {
    
    this.crequest.productId = this.user.controls['productId'].value;
  }

  validateRequest()
  {

  }

  addRequest() {
    let loading = this.loadingCtrl.create({
        content: 'Please wait...',         enableBackdropDismiss: true,
    });
    loading.present();
    if (this.user.valid) {

      switch (this.crequest.requestType) {
        case '1':
          this.crequest.unitName = this.unitName;
          this.crequest.fuelRequested = this.crequest.capacity;
          break;
        case '2':
          this.crequest.unitName = "₹";
          break;
        case '3':
          this.crequest.unitName = this.unitName;
          break;
      }
      if(this.crequest.fuelRequested==undefined && this.crequest.cashRequested==undefined)
      {
        this.basicData.sendErrorNotification("Please raise request against cash/fuel");
        loading.dismiss();
      }
      else
          
      {
      if(this.crequest.requestType==3 &&this.crequest.fuelRequested>this.crequest.capacity)
      {
        this.basicData.sendErrorNotification("Fuel requested is greater than its capacity");
        this.crequest.cashRequested = null;
        this.crequest.fuelRequested = null;
        loading.dismiss();
      }                          
      else
      {
        if(this.crequest.cashRequested!==undefined && this.crequest.cashRequested<0 ||this.crequest.fuelRequested!==undefined && this.crequest.fuelRequested<0)
        {
          this.basicData.sendErrorNotification("Sorry!!! You can only enter value greater than 0 and less than 20,000");
          this.crequest.cashRequested = null;
          this.crequest.fuelRequested = null;
          loading.dismiss();
        }
        else
        {
      console.log(this.crequest)
      this.transData.getRaiseRequest(this.crequest)
        .subscribe(status => {
          var raiseSucess = JSON.stringify(status);
          this.error = JSON.parse(raiseSucess).errors;
          if (this.error == undefined || this.error == null) {
            this.basicData.sendSuccessNotification("Raised request successfully");
           this.navCtrl.setRoot('RequestListPage');
            loading.dismiss();
          }
          else {
            this.basicData.sendErrorNotification("" + this.error);
            this.crequest.cashRequested = null;
            //this.crequest=null;
            loading.dismiss();
          }

        }, err => {
          this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
          loading.dismiss();
        });
      }
    }

  }

    }

    else {
      loading.dismiss();
      this.user.controls['vehicle'].markAsTouched();
      this.user.controls['pump'].markAsTouched();
    }
  }

  requestType(sel) {
    this.crequest.requestType = sel;
  }
  showRequest() {
    this.transData.getTransRequests(this.crequest.transporterId).subscribe(
      res => {
        this.transRequestList = res;
        this.transRequestList = res.filter(v => v.status !== 3);
        this.transRequestList = this.transRequestList.filter(v => v.status !== 4);
      }, err => {
        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      });
  }
  home() {
   this.navCtrl.setRoot('RequestListPage');
  }
  menuClick() {
    this.basicData.checkTransCount();
  }
}
