import { AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { IonicPage, NavController, App, NavParams, ToastController, Platform, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { RegularSale } from '../../../app/regular-sale';
import { SalesDataProvider } from '../../../providers/sales-data/sales-data';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';
import { PumpDataProvider } from '../../../providers/pump-data/pump-data';
import { DsmHomePage } from '../dsm-home/dsm-home';
import { DSMReports } from '../../../app/DSMReports';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
/**
 * Generated class for the NozzleTotalizerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-nozzle-totalizer',
  templateUrl: 'nozzle-totalizer.html',
})
export class NozzleTotalizerPage {
  public regular = new RegularSale;
  public dsm = new DSMReports;
  //valid:boolean;
  showButton: boolean;


  customOptions: FormArray;
  constructor(public navCtrl: NavController,
    public salesData: SalesDataProvider,
    public storage: Storage,
    public toast: ToastController,
    public alertCtrl:AlertController,
    public loadingCtrl: LoadingController,
    public platform: Platform,
    private fb: FormBuilder,
    public appCtrl: App,
    public basicData: BasicDataProvider,
    public pumpData: PumpDataProvider,
    public navParams: NavParams) {

    let backAction = this.platform.registerBackButtonAction(() => {
      this.navCtrl.setRoot(DsmHomePage);
      backAction();
    }, 1)

  }




  ionViewDidLoad() {
    this.storage.get('employeeId').then((val) => {
      this.dsm.employeeId = val;
    }, err => {
      console.log(err);
    });
    this.storage.get('pumpId').then((val) => {
      this.dsm.pumpId = val;
      this.showNoozle();
    }, err => {
      console.log(err);
    });
    let alert = this.alertCtrl.create({
      title: '<h3 text-center> Manager से कहें कि पहले आपकी Testing भरें. उसके बाद ही आप अपना रीडिंग भरें. ',
      enableBackdropDismiss: false,
      buttons: [
     
        {
          text: 'OK',
          handler: () => {
            let loading = this.loadingCtrl.create({
              content: 'Please wait...', enableBackdropDismiss: false,
            });
          }
        }
      ]
 
      });
      alert.present();
  }
  onChangeValue(event, i) {
    this.dsm.NoozleList[i].endReading = parseFloat(event).toFixed(2);
    if(parseFloat(this.dsm.NoozleList[i].startReading)>parseFloat(this.dsm.NoozleList[i].endReading))
    {
      let alert = this.alertCtrl.create({
        title: '<h3 text-center> End reading must be greater than start Reading',
        enableBackdropDismiss: false,
        buttons: [
       
          {
            text: 'OK',
            handler: () => {
              let loading = this.loadingCtrl.create({
                content: 'Please wait...', enableBackdropDismiss: false,
              });
            }
          }
        ]
   
        });
        alert.present();
    }
    else{
      this.dsm.NoozleList[i].totalSales=0;
      this.dsm.NoozleList[i].cashSales=0;
      this.dsm.NoozleList[i].totalSales=parseFloat(this.dsm.NoozleList[i].endReading)-parseFloat(this.dsm.NoozleList[i].startReading)
      this.dsm.NoozleList[i].cashSales=parseFloat(this.dsm.NoozleList[i].totalSales)-parseFloat(this.dsm.NoozleList[i].creditSalesTotal)
     
    }

   
    console.log(this.dsm.NoozleList[i])
  }

  showNoozle() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...', enableBackdropDismiss: true,
    });
    loading.present();
    this.salesData.getDSMNozzles(this.dsm.pumpId, this.dsm.employeeId, this.dsm.isTotalizer).subscribe(res => {
      loading.dismiss();
      this.dsm.NoozleList = res;
      console.log(res);
      var success = JSON.stringify(res);
      this.dsm.error = JSON.parse(success).errors;
      for (var i = 0; i < this.dsm.NoozleList.length; i++) {
        this.dsm.NoozleList[i].totalSales=0;
        this.dsm.NoozleList[i].cashSales=0;
        if (this.dsm.NoozleList[i].endReading == 0) {
          this.dsm.NoozleList[i].endReading = null;
        }
      }
      if (this.dsm.error == undefined || this.dsm.error == null || this.dsm.NoozleList.length == 0) {
        this.dsm.show = true;
        this.dsm.hide = false;
      }
      else {
        this.dsm.hide = true;
        this.dsm.show = false;
        this.basicData.sendErrorNotification("You have already enterd nozzle Totalizer");
      }

    }, err => {
      console.log(err);
      loading.dismiss();
      this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
    })
  }

  validateTotalizers() {
    var valid = true;

    let loading = this.loadingCtrl.create({
      content: 'Please wait...', enableBackdropDismiss: true,
    });
    loading.present();

    var count = 0;
    var totalminEndReading = 0;
    var totalEndReading = 0;

    console.log(totalminEndReading, totalEndReading)

    for (var i = 0; i < this.dsm.NoozleList.length; i++) {
      var total = 0;
      var startReading = parseFloat(this.dsm.NoozleList[i].startReading);
      var endReading = this.dsm.NoozleList[i].endReading;
      var minEndReading = this.dsm.NoozleList[i].minEndReading;
      total = minEndReading + parseFloat(this.dsm.NoozleList[i].testingQty);
      console.log(total, endReading)
      //Blank end reading
      if (endReading == undefined || endReading == null || endReading == "") {
        this.basicData.sendErrorNotification("Please enter all fields End Reading");
        this.dsm.NoozleList[i].endReading = null;
        valid = false;
        break;
      }
      //EndReading smaller than start Reading
      endReading = parseFloat(this.dsm.NoozleList[i].endReading);
      if (startReading > endReading) {
        this.basicData.sendErrorNotification("End Reading is inValid");
        this.dsm.NoozleList[i].endReading = null;
        valid = false;
        break;
      }
    }

    //TotalEndReading must be greater than actual sales
    for (var y = 0; y < this.dsm.NoozleList.length; y++) {
      totalminEndReading = totalminEndReading + this.dsm.NoozleList[y].TotalReading + parseFloat(this.dsm.NoozleList[y].testingQty);
      totalEndReading = totalEndReading + (parseFloat(this.dsm.NoozleList[y].endReading) - parseFloat(this.dsm.NoozleList[y].startReading));
    console.log(totalEndReading,totalminEndReading)
    }
    console.log(totalminEndReading,totalEndReading)
    if (totalminEndReading > totalEndReading) {
      this.basicData.sendErrorNotification("End Reading must be greater than Actual Sales");
      valid = false;
    }

    loading.dismiss();
    return valid;
  }


  saveNozzle(myObjStr) {
    if (this.validateTotalizers()) {
      console.log(true)
      const myObjStr = JSON.stringify(this.dsm.NoozleList);
      console.log(myObjStr)
      this.pumpData.addNozzleTotalizer(myObjStr).subscribe(res => {
        var success = JSON.stringify(res);
        console.log(res)
        var error = JSON.parse(success).error;
        if (error == undefined) {
          this.basicData.sendSuccessNotification("Nozzle list added successfully");
          this.navCtrl.setRoot(DsmHomePage);
        }
        else {
          this.basicData.sendErrorNotification(error);
        }
      }, err => {
        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      });
    }
  }

  home() {
    this.navCtrl.setRoot(DsmHomePage);
  }
}
