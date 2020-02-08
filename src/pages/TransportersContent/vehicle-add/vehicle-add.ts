
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonicPage, NavController, App, NavParams, Platform, ToastController, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Vehicle } from '../../../app/vehicle';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';
import { TransDataProvider } from '../../../providers/trans-data/trans-data';


@IonicPage()
@Component({
  selector: 'page-vehicle-add',
  templateUrl: 'vehicle-add.html',
})
export class VehicleAddPage {
  user: FormGroup;
  user1: FormGroup;
  public vehicle = new Vehicle;
  public driverList = [];
  public VehicleTypeList = [];
  public FuelTypeList = [];
  startDate: String;
  vehicleCount: number;
  currentYear: number;
  start: Date;
  endDate: String;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public platform: Platform,
    public basicData: BasicDataProvider,
    public toast: ToastController,
    public loadingCtrl: LoadingController,
    public appCtrl: App,
    public transData: TransDataProvider) {
    let backAction = this.platform.registerBackButtonAction(() => {
     this.navCtrl.setRoot('VehicleListPage');
      backAction();
    }, 1)
    var currentDate = new Date();
    this.currentYear = currentDate.getFullYear();
    this.vehicle.regNo = '';
    this.user = new FormGroup({
      // (/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$])(?=.{8,20})/)]
      regNo: new FormControl({ value: '' }, Validators.compose([Validators.required, Validators.maxLength(15)])),
      vehicleTypeId: new FormControl({ value: '' }, Validators.compose([Validators.required])),
      blanket: new FormControl({ value: '' }, Validators.compose([Validators.required])),
      fuelType: new FormControl({ value: '' }, Validators.compose([Validators.required])),

      capacity: new FormControl({ value: '' }, Validators.compose([Validators.required, Validators.min(1)])),
    });
    this.user1=new FormGroup({
      blanketCash: new FormControl({ value: '' }, Validators.compose([Validators.required])),
      blanketFuel: new FormControl({ value: '' }, Validators.compose([Validators.required])),
    })

    this.storage.get('username').then((val) => {
      this.vehicle.updated_by = val;
    },err=>{
      console.log(err);
    });

    this.storage.get('pumpId').then((val) => {
      this.vehicle.pumpId = val;
    },err=>{
      console.log(err);
    });

    this.storage.get('transporterId').then((val) => {
      this.vehicle.transporterId = val;
      // this.showDriver();
      this.showfuelType();
      this.showvehicleType();
    },err=>{
      console.log(err);
    });
    this.vehicle.active = 1;
    this.vehicle.vehicleTypeId=1
    this.vehicle.vehicleFuelId=1;
    this.vehicle.unitName="Liter";
    this.vehicle.unitId=1;
    this.vehicle.prodGroupId=1;
    this.vehicle.capacity=1000;
    this.vehicle.blanket=1;
    this.vehicle.blanketFuel=1000;
    this.vehicle.blanketCash=0;

  }

  ionViewDidLoad() {
    this.storage.get('vehicleCount').then((val) => {
      this.vehicleCount = val;
    },err=>{
      console.log(err);
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
  // showDriver() {
  //   this.transData.getTDrivers(this.vehicle.transporterId).subscribe(res => {
  //     this.driverList = res.filter(v => v.active == 1)

  //   }, err => {
  //     this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
  //   });
  // }
  showfuelType() {
    this.transData.getFuelType().subscribe(res => {
      this.FuelTypeList = res;
    }, err => {
      this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
    });
  }
  showvehicleType() {
    this.transData.getVehicleType().subscribe(res => {
      this.VehicleTypeList = res;
         
    }, err => {
      this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
    });
  }

  onChangeVehicle(val)
  {
    console.log(val,this.vehicle.vehicleTypeId)
  }
  addVehicle() {
    console.log(this.vehicle);
    let loading = this.loadingCtrl.create({
        content: 'Please wait...',         enableBackdropDismiss: true,
    });
    loading.present();
    if (this.user.valid) {
      this.vehicle.regNo = this.vehicle.regNo.replace(/\s/g, "");

      console.log(this.vehicle.regNo);
      if (parseFloat(this.vehicle.blanketFuel) > parseFloat(this.vehicle.capacity)) {
        this.basicData.sendErrorNotification("Blanket Fuel is greater than Capacity");
        this.vehicle.blanketFuel = null;
        loading.dismiss();
      }
      else {
  if(this.vehicle.blanket==1)
  {
    if(this.user1.valid)
    {
      this.vehicle.active = 1;
      this.transData.addVehicle(this.vehicle).subscribe(res => {
        this.vehicle = res;
        console.log(res);
        loading.dismiss();
        let Sucess = JSON.stringify(res);
        let error = JSON.parse(Sucess).errors;
        console.log(error);
        if(error == undefined || error ==null)
        {
          this.basicData.sendSuccessNotification("Vehicle Added Successfully");
          this.navCtrl.setRoot('VehicleListPage');
        }
        else
        {
          this.basicData.sendErrorNotification(error);
        }
  
      }, err => {
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
  else
  {
        this.vehicle.active = 1;
        this.transData.addVehicle(this.vehicle).subscribe(res => {
          this.vehicle = res;
          console.log(res);
          loading.dismiss();
          let Sucess = JSON.stringify(res);
          let error = JSON.parse(Sucess).errors;
          console.log(error);
          if(error == undefined || error ==null)
          {
            this.basicData.sendSuccessNotification("Vehicle Added Successfully");
            this.navCtrl.setRoot('VehicleListPage');
          }
          else
          {
            this.basicData.sendErrorNotification(error);
          }
    
        }, err => {
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
      this.user.controls['fuelType'].markAsTouched();
      this.user.controls['capacity'].markAsTouched();
      loading.dismiss();
    }
 
  }


  onChange(reqFuel) {
    for (var i = 0; i < this.FuelTypeList.length; i++) {
      if (this.FuelTypeList[i].id == reqFuel) {
        this.vehicle.unitName = this.FuelTypeList[i].unitName;
        this.vehicle.unitId = this.FuelTypeList[i].unitId;
        this.vehicle.prodGroupId = this.FuelTypeList[i].id;
      }
    }
console.log(this.vehicle.vehicleFuelId,this.vehicle.unitName,this.vehicle.unitId,this.vehicle.prodGroupId)

  }


  home() {
   this.navCtrl.setRoot('VehicleListPage');
  }
  menuClick() {
    this.basicData.checkTransCount();
  }
}
