import { TransporterPage } from './../transporter/transporter';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonicPage, NavController, App, NavParams, ToastController, Platform, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';
import { TransDataProvider } from '../../../providers/trans-data/trans-data';
import { Vehicle } from '../../../app/vehicle';

@IonicPage()
@Component({
  selector: 'page-vehicle-edit',
  templateUrl: 'vehicle-edit.html',
})
export class VehicleEditPage {
  user: FormGroup;
  user1: FormGroup;
  public vehicle = new Vehicle;
  public pumpId: any;
  public transporterId: any;
  public username: any;
  public errorMsg;
  public i: number;
  public currentYear: number;
  public driverList = [];
  public VehicleTypeList = [];
  public FuelTypeList = [];
  public vehicleList: any;
  constructor(public navCtrl: NavController,
    public toast: ToastController,
    public platform: Platform,
    public appCtrl: App,
    public loadingCtrl: LoadingController,
    public basicData: BasicDataProvider,
    public navParams: NavParams,
    public storage: Storage,
    public transData: TransDataProvider) {
    let backAction = this.platform.registerBackButtonAction(() => {
     this.navCtrl.setRoot('VehicleListPage');
      backAction();
    }, 1)
    var currentDate = new Date();
    this.currentYear = currentDate.getFullYear();
    this.user = new FormGroup({
      // (/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$])(?=.{8,20})/)]
      regNo: new FormControl({ value: '' }, Validators.compose([Validators.required, Validators.maxLength(15)])),
     // regYear: new FormControl({ value: '' }, Validators.compose([Validators.required, Validators.max(this.currentYear), Validators.maxLength(4), Validators.minLength(4)])),
      vehicleTypeId: new FormControl({ value: '' }, Validators.compose([Validators.required])),
      blanket: new FormControl({ value: '' }, Validators.compose([Validators.required])),
      fuelType: new FormControl({ value: '' }, Validators.compose([Validators.required])),

      capacity: new FormControl({ value: '' }, Validators.compose([Validators.required, Validators.min(1)])),
    });
    this.user1=new FormGroup({
      blanketCash: new FormControl({ value: '' }, Validators.compose([Validators.required])),
      blanketFuel: new FormControl({ value: '' }, Validators.compose([Validators.required])),
    })
  }

  ionViewDidLoad() {
    this.storage.get('username').then((val) => {
      this.username = val;
    },err=>{
      console.log(err);
    });

    this.storage.get('pumpId').then((val) => {
      this.pumpId = val;
    },err=>{
      console.log(err);
    });

    this.storage.get('transporterId').then((val) => {
      this.transporterId = val;
     // this.showDriver();
      this.showfuelType();
      this.showvehicleType();
    },err=>{
      console.log(err);
    });
    let id = this.navParams.get('id');
    //console.log("Id= "+id);
    this.showVehicle(id);
    this.vehicle.pumpId = this.pumpId;
    this.vehicle.transporterId = this.transporterId;
    this.vehicle.updated_by = this.username;
  }

  showVehicle(id) {
    let loading = this.loadingCtrl.create({
        content: 'Please wait...',         enableBackdropDismiss: true,
    });
    loading.present();
    this.transData.getVehicle(id)
      .subscribe(response => {
        loading.dismiss();
        this.vehicle = response;
        // this.vehicleList = response.vehicle;

        var Suc = JSON.stringify(response);
    this.vehicleList= JSON.parse(Suc).vehicle;
    this.vehicle= JSON.parse(Suc).vehicle;
      }, err => {
        this.errorMsg = err;
        loading.dismiss();
        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      });
  }

  blanketUpdate(blanket) {
    if (!blanket) {
      this.vehicle.blanketCash = null;
      this.vehicle.blanketFuel = null;
    }
    else
    {
      this.vehicle.blanketCash=0;
    }
  }

  updateVehicle() {
    let loading = this.loadingCtrl.create({
        content: 'Please wait...',         enableBackdropDismiss: true,
    });
    loading.present();
  if (this.user.valid) {
    this.vehicle.regNo = this.vehicle.regNo.replace(/\s/g, "");
      if (this.vehicle.blanketFuel > this.vehicle.capacity) {
        this.basicData.sendErrorNotification("Blanket Fuel is greater than Capacity");
        loading.dismiss();
        this.vehicle.blanket = null;
      }
      else {
        if(this.vehicle.blanket==1)
        {
          if(this.user1.valid)
          {
        this.transData.updateVehicle(this.vehicle, this.vehicle.id).subscribe(res => {
          this.vehicle = res;
          this.vehicle.updated_by = this.username;
          this.basicData.sendSuccessNotification("Vehicle updated successfully");
         this.navCtrl.setRoot('VehicleListPage');
          loading.dismiss();
        }, err => {
          this.errorMsg = err;
          this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
          loading.dismiss();
        })
      }
      else
      {
        this.user1.controls['blanketCash'].markAsTouched();
        this.user1.controls['blanketFuel'].markAsTouched();
        loading.dismiss();
      }
    }
  else{
      this.transData.updateVehicle(this.vehicle, this.vehicle.id).subscribe(res => {
        this.vehicle = res;
        this.vehicle.updated_by = this.username;
        this.basicData.sendSuccessNotification("Vehicle updated successfully");
       this.navCtrl.setRoot('VehicleListPage');
        loading.dismiss();
      }, err => {
        this.errorMsg = err;
        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
        loading.dismiss();
      })
    }
  }
}
    else {
      this.user.controls['regNo'].markAsTouched();
     // this.user.controls['regYear'].markAsTouched();
      this.user.controls['vehicleTypeId'].markAsTouched();
      //  this.user.controls['tdriverId'].markAsTouched();
      this.user.controls['fuelType'].markAsTouched();
      this.user.controls['unitName'].markAsTouched();
      this.user.controls['capacity'].markAsTouched();
      loading.dismiss();
    }
  }

 
  onChange(reqFuel) {

    for (this.i = 0; this.i < this.FuelTypeList.length; this.i++) {
      if (this.FuelTypeList[this.i].id == reqFuel) {
        this.vehicle.unitName = this.FuelTypeList[this.i].unitName;
        this.vehicle.unitId = this.FuelTypeList[this.i].unitId;
        this.vehicle.prodGroupId = this.FuelTypeList[this.i].id;
      }
    }
  }

  // showDriver() {
  //   this.transData.getTDrivers(this.transporterId).subscribe(res => {
  //     this.driverList = res.filter(v => v.active == 1);
  //   }, err => {
  //     this.errorMsg = err;
  //     this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
  //   });
  // }
  showfuelType() {
    this.transData.getFuelType().subscribe(res => {
      this.FuelTypeList = res;
    }, err => {
      this.errorMsg = err;
      this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
    });
  }
  showvehicleType() {
    this.transData.getVehicleType().subscribe(res => {
      this.VehicleTypeList = res.filter(v => v.active == 1);
    }, err => {
      this.errorMsg = err;
      this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
    });
  }

  doRefresh(refresher) {
    this.ionViewDidLoad();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
  home() {
   this.navCtrl.setRoot('VehicleListPage');
  }
  menuClick() {
    this.basicData.checkTransCount();
  }
}
