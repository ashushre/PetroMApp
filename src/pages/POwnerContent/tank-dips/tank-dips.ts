
import { Component } from '@angular/core';
import { IonicPage, App, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FormGroup} from '@angular/forms';
import { tankDip } from '../../../app/tank.dip';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';
import { PumpDataProvider } from '../../../providers/pump-data/pump-data';
import { PManagerHomePage } from '../../PMAnagerContent/p-manager-home/p-manager-home';
/**
 * Generated class for the TankDipsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tank-dips',
  templateUrl: 'tank-dips.html',
})
export class TankDipsPage {
  user: FormGroup;
  public pumpId: number;
  public tankList: any;
  public success: any;
  public error: any;
  public sampleList: any;
  public tankDipSave = new tankDip;
  public tankDetail: any[];
  public literValue: number;
  public selectp: Boolean = false;
  public entrySave:Boolean=true;
  public show: Boolean = false;
  public hide: Boolean = true;
  public insideLength: number;
  public counter = 0;
  public insideDiameter: number;
  public insideDip: number;
  public fillRequire: boolean = false;
  public dip: number;
  public username: string;
  public pi = 3.14;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public loadingCtrl:LoadingController,
    public appCtrl: App,
    public basicData: BasicDataProvider,
    public pumpData: PumpDataProvider) {

  }

  ionViewDidLoad() { 
    this.storage.get('pumpId').then((val) => {
      this.pumpId = val;
      this.getTankList();
      this.ssign();
    },err=>{
      console.log(err);
    });
    this.storage.get('username').then((val) => {
      this.username = val;
    }),err=>{
      console.log(err);
    };
  }
  getTankList() {
    let loading = this.loadingCtrl.create({
        content: 'Please wait...',         enableBackdropDismiss: true,
    });
    loading.present();
    this.pumpData.getTankDip(this.pumpId).subscribe(res => {
      loading.dismiss();
      this.tankList = res;
      console.log(res);
      if (this.tankList[0].dip == undefined || this.tankList[0].dip==null) {
        this.show = true;
        this.hide = false;
      }
      else{
        this.show=false;
        this.hide=true;
      }
    }, err => {

      this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      loading.dismiss();
    })
  }
  ssign() {
    var i;
    this.tankDetail = [];
    for (i = 0; i < this.tankDetail.length; i++) {
      this.tankDetail[i] = 0;
    }
  }
  totalLiters(dip1, prod,index) {
    this.dip = dip1;
    console.log(index)
  var insideDiaTotal=prod.insideDia*100;
    if(dip1>insideDiaTotal)
    {
this.basicData.sendErrorNotification("Enter valid Dip");

    }
    else
    {
    this.insideDiameter = prod.insideDia;
    this.insideLength = prod.insideLength;
    var length = 100 * this.insideLength;
    var diameter = 100 * this.insideDiameter;
    var dip = parseFloat(dip1);
    var radius = diameter / 2.000;

    if (dip == radius) {
      var vFuel = (1.000 / 2.000) * this.pi * radius * radius * length;     //Volume of fuel in cetimeter cube
    }
    else if (dip > radius && dip <= diameter) {
      var height = 2.000 * radius - dip;   //hieght above fuel
      var tHeight = radius - height;   //Triangle height
      var theta = 2.000 * (Math.acos(tHeight / radius));  //Amgle in radian created by arc (segment)
      var aSegment = (1.000 / 2.000) * radius * radius * (theta - Math.sin(theta));      //Area of the segment above fuel
      var aFuel = this.pi * radius * radius - aSegment;           //Area of fuel segment in centimeter square
       vFuel = aFuel * length;               //Volume of fuel in cetimeter cube
    }
    else if (dip < radius && dip > 0) {
      height = dip;   //hieght of the fuel
      tHeight = radius - height;   //Triangle height
      theta = 2.000 * (Math.acos(tHeight / radius));  //Amgle in radian created by arc (segment)
      aSegment = (1.000 / 2.000) * radius * radius * (theta - Math.sin(theta));      //Area of the segment above fuel
      aFuel = aSegment;           //Area of fuel segment in centimeter square
      vFuel = aFuel * length;               //Volume of fuel in cetimeter cube
    }
    else {
      prod.literValue = 0;
    }
    prod.literValue = vFuel / 1000.000;   
    for (var i = 0; i < this.tankList.length; i++) {
      if (index == i) {

        this.tankList[i].dip = dip1;
        this.tankList[i].stock = prod.literValue;
        console.log(this.tankList[i].dip ,i)
      }
    }
  }
  }
  save() {
  
    for (var i = 0; i < this.tankList.length; i++) {
      if (this.tankList[i].dip == undefined) {
        this.fillRequire = true;
      }
    }
  }
  Save() {
    this.save();
    let loading = this.loadingCtrl.create({
        content: 'Please wait...',         enableBackdropDismiss: true,
    });
    loading.present();
    if (this.fillRequire) {
      this.basicData.sendErrorNotification("Please enter all dips");
      loading.dismiss();
    }
    else {
      var count = 0;
      this.sampleList = [];
      for (var i = 0; i < this.tankList.length; i++) {
        this.tankDipSave = new tankDip;
        this.tankDipSave.dip = this.tankList[i].dip;
        this.tankDipSave.stock = this.tankList[i].stock;
        this.tankDipSave.updated_by = this.username;
        this.tankDipSave.productId = this.tankList[i].productId;
        this.tankDipSave.pumpId = this.tankList[i].pumpId;
        this.tankDipSave.tankId = this.tankList[i].id;
console.log(this.tankList[i].dip)
        this.sampleList[count] = this.tankDipSave;
        count++;
      }
      const myObjStr = JSON.stringify(this.sampleList);
      console.log(myObjStr);
       this.pumpData.addTankDip(myObjStr).subscribe(res => {
        this.success = JSON.stringify(res);
        var sample = JSON.parse(this.success).error;
        this.error = JSON.parse(this.success).error;
        if (this.error == undefined || this.error == null) {
          this.basicData.sendSuccessNotification("Tank Dips saved successfully");
         this.navCtrl.setRoot(PManagerHomePage);
          loading.dismiss();
        }
        else {
          this.basicData.sendErrorNotification("" + JSON.parse(this.success).error);
          loading.dismiss();
        }
      }, err => {

        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
        loading.dismiss();
     });
    }
  }
  home() {
   this.navCtrl.setRoot(PManagerHomePage);
  }
  
  menuClick() {
    this.basicData.checkPumpCount();
  }
}

