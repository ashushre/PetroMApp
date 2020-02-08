import { NozzleTesting } from './../../../app/nozzleTesting';
import { PumpDataProvider } from '../../../providers/pump-data/pump-data';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { PManagerHomePage } from '../p-manager-home/p-manager-home';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';

/**
 * Generated class for the NozzleTestingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-nozzle-testing',
  templateUrl: 'nozzle-testing.html',
})
export class NozzleTestingPage {
  public nozzle: NozzleTesting[] = [];
  public nozzleSend = new NozzleTesting;
  public nozzleData = new NozzleTesting();
  nozzleListTest: any;
  showError:boolean;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public basicData: BasicDataProvider,
    public storage: Storage,
    public pumpData: PumpDataProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NozzleTestingPage');
    this.storage.get("pumpId").then(val => {
      this.nozzleData.pumpId = val;
      this.showNozzle();
      this.setListSero();
    }, err => {
      console.log(err);
    });
    this.storage.get("username").then(val => {
      this.nozzleData.updated_by = val;
    }, err => {
      console.log(err);
    });
  }

  showNozzle() {
    this.pumpData.getNozzleTesting(this.nozzleData.pumpId).subscribe(res => {
      console.log(res);

      // if(res==null)
      // {
      //   this.showError=true;
      // }
      // else{
       // this.showError=false;
        this.nozzle = res;
      for (var i = 0; i < res.length; i++) {
        this.nozzle[i].updated_by= this.nozzleData.updated_by;
        this.nozzle[i].pumpId= this.nozzleData.pumpId;
        for (var j = 0; j < res[i].nozzle.length; j++) {
          if (res[i].nozzle[j].testingQty == 0.00) {
            this.nozzle[i].nozzle[j].rOnly= 1;
            res[i].nozzle[j].testingQty = null;
          }
          else{
            this.nozzle[i].nozzle[j].rOnly= 0;
          }
        }
      }
   // }
      console.log(this.nozzle)
    })
  }

  home() {
    this.navCtrl.setRoot(PManagerHomePage);
  }

  menuClick() {
    this.basicData.checkPumpCount();
  }

  submit() {

    console.log(this.nozzle);
    for (var i = 0; i < this.nozzle.length; i++) {
      //this.nozzle[i].updated_by= this.nozzleData.updated_by;
     // this.nozzle[i].pumpId= this.nozzleData.pumpId;
      for (var j = 0; j < this.nozzle[i].nozzle.length; j++) {
        if (this.nozzle[i].nozzle[j].testingQty ==null) {

          this.nozzle[i].nozzle[j].testingQty = 0.00;
        }
      }
    }
    this.pumpData.addNozzleTesting(this.nozzle).subscribe(res => {
      console.log(res);
      var success = JSON.stringify(res);
      var error = JSON.parse(success).success;
      this.basicData.sendSuccessNotification(error);
      this.navCtrl.setRoot(PManagerHomePage);
    })

  }

  setListSero() {
    var i;
    this.nozzleListTest = [];
    for (i = 0; i < this.nozzle.length; i++) {
      this.nozzleListTest[i];
    }
  }

  onChangeAmount(value, id) {
    console.log(value, id);
    for (var i = 0; i < this.nozzle.length; i++) {
      for (var j = i; j < this.nozzle[i].nozzle.length; j++) {
        if (this.nozzle[i].nozzle[j].empNid == id) {
          console.log(value);
          this.nozzle[i].nozzle[j].testingQty = value;
        }
      }
    }
  }
}
