import { ToastController, Platform, LoadingController, AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { DsmHomePage } from '../dsm-home/dsm-home';
import { CreditSale } from '../../../app/credit.sale';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';
import { SalesDataProvider } from '../../../providers/sales-data/sales-data';
import { TransDataProvider } from '../../../providers/trans-data/trans-data';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { isDefaultChangeDetectionStrategy } from '@angular/core/src/change_detection/constants';
@IonicPage()
@Component({
  selector: 'page-credit-sale',
  templateUrl: 'credit-sale.html',
})
export class CreditSalePage {
  user: FormGroup;
  user1:FormGroup;
  public crequest = new CreditSale
  public pumpresList: CreditSale[];
  public DSMList: CreditSale;
  public pumpList = [];
  public nozzleList = [];
  QRnoozleList: any;
  toFix:any;
  FuelActual:any;
  public man: any;
  public pumpListFilter: any;
  public prodRateList: any;
  public nozzleSelect: boolean;
  public unit: boolean = false;
  public unitName: boolean = true;
  nozzleListFilter: any;
  currentRate:number;
  scanData: any;

  options: BarcodeScannerOptions;
  showEmpty: boolean;
  transporter: boolean = false;
  transporterInput: boolean = false;
  showFullTank: boolean = false;
  Blanket: any;
  public query = '';
  CashActual: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public toast: ToastController,
    public platform: Platform,
    public brScanner: BarcodeScanner,
    public alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    public basicData: BasicDataProvider,
    public salesData: SalesDataProvider,
    public storage: Storage,
    public transData: TransDataProvider,
    public appCtrl: App) {
    this.user = new FormGroup
      ({
          invoiceNo: new FormControl({ value: '' }, 
          Validators.compose([Validators.required,Validators.maxLength(10),  
          Validators.pattern('[0-9]*')])),
          fuelActual: new FormControl({ value: '' },
          Validators.compose([Validators.required])),
      });
      this.user1 = new FormGroup
      ({
     
          cashActual: new FormControl({ value: '' },
          Validators.compose([Validators.required])),
      });

    this.crequest.requestComplete = 'N';
    let backAction = this.platform.registerBackButtonAction(() => {
      this.navCtrl.setRoot(DsmHomePage);
      backAction();
    }, 1)
  }
  ionViewDidLoad() {
    this.storage.get('pumpId').then((val) => {
      this.crequest.pumpId = val;
      this.showRequests();
      this.showRates();
    }, err => {
      console.log(err);
    });
    this.storage.get('employeeId').then((val) => {
      this.crequest.employeeId = val;
      this.crequest.DSMId = val;
    }, err => {
      console.log(err);
    });
    this.storage.get('username').then((val) => {
      this.crequest.updated_by = val;
    }), err => {
      console.log(err);
    };
    this.storage.get('managerId').then((val) => {
      this.crequest.managerId = val;
      this.showNoozle();
    }, err => {
      console.log(err);
    });
  }

  //Raised request regNo list
  showRequests() {
    this.salesData.getRequests(this.crequest.pumpId).subscribe(res => 
      {
        //this.pumpresList = res.filter(v => v.status == 1);
        // this.pumpresList = res.filter(v => v.status == 1);
        // this.pumpresList = res.filter(v => v.status != 4);
        // this.pumpresList = this.pumpresList.filter(v => v.status != 3);
        this.pumpresList=res;
        for (var i = 0; i < this.pumpresList.length; i++) {
          this.pumpList[i] = this.pumpresList[i].regNo;//sorts only regNo in PumpList
        }
        console.log(res)
      }, 
      err => 
      {
        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      });

  }

  showNoozle() {
    var totalizer=0;
    this.salesData.getDSMNozzles(this.crequest.pumpId, this.crequest.employeeId,totalizer).subscribe(res =>
      {
        this.nozzleList = res;
        this.crequest.cashInvoice="";
      }, err => {
        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      })
  }

  //on Vehicle no search function
  filter() {
    if (this.query !== "") 
          {
            if (this.query.length > 2) 
              {
                this.pumpListFilter = this.pumpList.filter(function (el) {
                return el.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
                }.bind(this));
                if (this.pumpListFilter.length == 0) 
                  {
                    this.showEmpty = true;
                  }
                else 
                  {
                    this.showEmpty = false;
                  }
                }
            } 

      else {
              this.pumpListFilter = [];
            }
  }

  select(regNo) {

    let loading = this.loadingCtrl.create({
      content: 'Please wait...', enableBackdropDismiss: true,
    });
    loading.present();

    this.query = regNo;
    this.scanData = null;
    this.QRnoozleList = null;
    this.crequest.regNo = this.query;


    this.salesData.getDSMRequest(this.crequest.pumpId, regNo).subscribe(res => 
      {
        loading.dismiss();
        
        //initialize all values blank
        this.crequest.fuelActual = null;
        this.crequest.invoiceNo = null;
        this.crequest.nozzleId = null;
        this.transporter = false;
        this.showFullTank = false;
        this.transporterInput = false;

        console.log(res);
        var success = JSON.stringify(res);
        var error = JSON.parse(success).errors;//to find if error present

        if (error == undefined || error == null) 
          {
            this.query = '';
            this.DSMList = res;
            this.Blanket = 'Non Blanket';
            this.man = res;
            this.crequest.cashRequested=this.man.cashRequested;
            this.nozzleListFilter = this.nozzleList.filter(v => v.productId == this.man.productId);
            this.crequest.requestId = this.man.id;
            this.crequest.capacity = this.man.capacity;
            this.crequest.transporterId = this.man.transporterId;
            this.crequest.fuelRequested = parseFloat(this.man.fuelRequested);
            
            var prodRate = this.prodRateList.filter(v => v.id == this.man.productId);
            console.log(this.prodRateList)
            this.currentRate=prodRate[0].currentRate;
            var success = JSON.stringify(res);
            var error = JSON.parse(success).errors;
            if(this.DSMList.status==2 || this.DSMList.fuelRequested==0.00)
            {
              this.transporter = true;
              console.log(this.DSMList.cashRequested,this.transporterInput)
              this.transporterInput=true
            }
            else
            {
            if (this.man.requestType == 2) 
              { 
                this.crequest.fuelRequested = this.crequest.fuelRequested / prodRate[0].currentRate;
                this.toFix = this.crequest.fuelRequested;
                this.crequest.fuelRequested=parseFloat(this.toFix.toFixed(2));
                console.log(this.crequest.fuelRequested)
                this.transporter = true;
                this.transporterInput = false;
                this.unit = true;
                this.unitName = false;
              }
              if (this.man.requestType == 3) 
              { 
                this.transporter = true;
                this.transporterInput = false;
                this.unit = false;
                this.unitName = true;
              }

            if (this.man.requestType == 1) 
              {
                this.transporter = true;
                this.showFullTank = true;
                this.transporterInput = false;
                this.unit = false;
                this.unitName = false;
              }

            if (this.nozzleListFilter.length == 0) 
              {
                this.transporter = false;
                this.nozzleSelect = false;
                this.showFullTank = false;
                this.basicData.sendErrorNotification("You don't have valid Nozzle to fill this vehicle");
              }

            else 
              {
                this.transporter = true;
                this.transporterInput = false;
                // this.OTP=true;
                this.nozzleSelect = true;
              }

            }
          }
          else 
            {
              this.query = '';
              this.basicData.sendErrorNotification(error);
            }

      }, 
    err => 
      {
        loading.dismiss();
        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      });
  }

 

  getBlanket(regNo) {
    this.crequest.regNo = regNo;
    this.showEmpty = false;
    this.salesData.getDSMBlanketRequest(this.crequest.pumpId, regNo, this.crequest.updated_by, this.crequest.DSMId, 0)
      .subscribe(res => {
        console.log(res);
        this.scanData = null;
        this.QRnoozleList = null;

        var success = JSON.stringify(res);
        var error = JSON.parse(success).errors;
        var transporter = res.transporters;
        console.log(transporter)
        if (error == undefined || error == null) 
          {
            if (transporter.length == 0) 
              {
                this.basicData.sendErrorNotification("Sorry this is not blanket vehicle")
              }
            else 
              {
                let myAlert = this.alertCtrl.create();
                myAlert.setTitle('Please select Transporter');

                for (let i = 0; i < transporter.length; i++) 
                {
                  myAlert.addInput({
                    type: 'radio',
                    label: transporter[i].name,
                    value: transporter[i].id,
                  })
                }

                myAlert.addButton
              ({
                text: "Ok",
                handler: data => 
                {
                  this.salesData.getDSMBlanketRequest(this.crequest.pumpId, regNo, this.crequest.updated_by, this.crequest.DSMId, data).subscribe(res => 
                    {
                      console.log(res);
                      var success1 = JSON.stringify(res);
                      var error1 = JSON.parse(success1).errors;
                    if (error1 == undefined || error1 == null) 
                    {
                      console.log(transporter, transporter.length)
                      this.query = '';
                      this.DSMList = res;
                      this.Blanket = 'Blanket';
                      this.man = res;
                      this.transporter = true;
                      this.crequest.requestId = this.man.id;
                      this.crequest.capacity = this.man.capacity;
                      
                      // this.crequest.otp=this.man.otp;
                      this.crequest.tdriverId = this.man.tdriverId;
                      this.crequest.transporterId = this.man.transporterId;
                      this.nozzleListFilter = this.nozzleList.filter(v => v.productId == this.man.productId);
                      this.crequest.fuelRequested = parseFloat(this.man.fuelRequested);
                      var prodRate = this.prodRateList.filter(v => v.id == this.man.productId)
                      this.currentRate=prodRate[0].currentRate;
                      console.log(this.nozzleList);
                      if (this.nozzleListFilter.length == 0) {
                        this.transporter = false;
                        this.nozzleSelect = false;
                        this.basicData.sendErrorNotification("You don't have valid Nozzle to fill this vehicle");
                      }
                      else {
                        this.transporter = true;
                        this.transporterInput = false;
                        this.nozzleSelect = true;
                      }
                    } 
                    else 
                    {
                      this.basicData.sendErrorNotification(error1);
                    }
                  });
              }
            })
          myAlert.present();

        }

      }
      else 
        {
          this.basicData.sendErrorNotification(error);
        }

      }, err => {
        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      });
           
}

          //   this.query = '';
          //   this.DSMList = res;
          //   this.Blanket = 'Blanket';
          //   this.man = res;
          //   this.transporter = true;
          //   this.transporterdriver = true;
          //   this.crequest.managerId = this.man.managerId;
          //   this.crequest.requestId = this.man.id;
          //   this.transporterId = this.man.transporterId;
          //   this.crequest.capacity = this.man.capacity;
          //   // this.crequest.otp=this.man.otp;
          //   this.crequest.tdriverId = this.man.tdriverId;
          //   this.crequest.transporterId = this.man.transporterId;
          //   this.nozzleListFilter = this.nozzleList.filter(v => v.productId == this.man.productId);
          //   this.crequest.pumpId = this.man.pumpId;
          //   this.crequest.fuelRequested = parseFloat(this.man.fuelRequested);
          //   if (this.nozzleListFilter.length == 0) {
          //     this.transporter = false;
          //     this.basicData.sendErrorNotification("You don't have valid Nozzle to fill this vehicle");
          //   }
          //   else {
          //     this.transporter = true;
          //     this.transporterInput = true;
          //   }
          // }

          Invoice()
          {
            console.log(1,this.DSMList.cashRequested,this.crequest.cashInvoice,this.crequest.invoiceNo)
            if(this.DSMList.cashRequested!=0.00)
            {
              this.crequest.cashInvoice=this.crequest.invoiceNo+'C';
            }
          }

  validateRequest() {
    var valid = true;
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      enableBackdropDismiss: false,
    });
    loading.present();
    this.CashActual=this.crequest.cashActual;
    this.CashActual=parseFloat(this.CashActual);

if(this.DSMList.fuelRequested!=0.00 && this.DSMList.status==1)
{
  console.log(1)
    if (!this.user.valid) {
      this.user.controls['invoiceNo'].markAsTouched();
     // this.user.controls['nozzle'].markAsTouched();
      this.user.controls['fuelActual'].markAsTouched();
      valid = false;
    }

    if ((this.crequest.fuelActual) > (this.crequest.fuelRequested)) {
      console.log(this.crequest.fuelActual,this.crequest.fuelRequested)
      this.basicData.sendErrorNotification("Fuel is greater than Fuel Requested");
      this.crequest.fuelActual = null;
      this.crequest.invoiceNo = null;
      valid = false;
    }

    if (this.crequest.fuelActual < 0) {
      this.basicData.sendErrorNotification("Enter valid Fuel");
      this.crequest.fuelActual = null;
      valid = false;
    }

    if (this.crequest.fuelActual > this.crequest.capacity) {
      this.basicData.sendErrorNotification("Actual Fuel is greater than its capacity");
      this.crequest.fuelActual = null;
      valid = false;
    }
  }
  console.log(this.DSMList.cashRequested,this.DSMList.fuelActual,this.crequest.cashActual,this.CashActual)
  if((this.DSMList.cashRequested!=0.00 || this.DSMList.fuelActual!=0.00)&& (this.crequest.cashActual!=undefined || this.crequest.cashActual!=null)&&  isNaN(this.CashActual)==false || this.DSMList.status==2 )
  {
    console.log(this.crequest,this.CashActual,this.DSMList.cashRequested)
    if (!this.user1.valid) {
      this.user1.controls['cashActual'].markAsTouched();
      valid = false;
    }
console.log((this.crequest.cashRequested),this.CashActual)
    if ((this.CashActual) > (this.crequest.cashRequested)) {
      console.log(this.crequest.cashActual,this.DSMList.cashRequested)
      this.basicData.sendErrorNotification("Cash is greater than Cash Requested");
      this.crequest.cashActual = null;
      this.crequest.cashInvoice = null;
      valid = false;
    }

    if (this.CashActual < 0) {
      this.basicData.sendErrorNotification("Enter valid Cash");
      this.crequest.cashActual = null;
      valid = false;
    }

  }
console.log(valid)
    loading.dismiss();
    return valid;
  }

  addRequest() {
    if (this.validateRequest()) {
      if(this.crequest.fuelActual==undefined)
      {
        this.crequest.fuelActual=this.DSMList.fuelActual;
      }
      var amount=this.crequest.fuelActual*this.currentRate;
     var Amount=amount.toFixed(2);
     this.FuelActual=this.crequest.fuelActual;
     this.FuelActual=parseFloat(this.FuelActual).toFixed(2);
    // var Fuel=parseFloat(this.crequest.fuelActual).toFixed(2);

    Amount=parseFloat(Amount).toFixed(2);
    var result = Amount.toString().split('.');
    var lastThree = result[0].substring(result[0].length - 3);
    var otherNumbers = result[0].substring(0, result[0].length - 3);
    if (otherNumbers != '' && otherNumbers != '-')
        lastThree = ',' + lastThree;
    var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

    if (result.length > 1) {
        output += "." + result[1];
    }
    console.log(this.DSMList.cashRequested,this.CashActual, this.DSMList.status)
    if((this.CashActual==undefined ||isNaN(this.CashActual)==true)&& this.DSMList.status!=2 )
    {
      this.showAlert(output)
    }
    if(this.DSMList.status==2)
    {
      this.showAlertCash()
    }
  
    if(this.crequest.fuelActual!=0.00 && this.crequest.cashActual!=0.00 && this.crequest.cashActual!=undefined && this.DSMList.status!=2)
    {
      this.showAlertFuelCash(output)
    }

  }
  }
fuelSubmit(value)
{

          let loading = this.loadingCtrl.create({
            content: 'Please wait...', enableBackdropDismiss: true,
          });
          loading.present();
 this.salesData.getFuelDispense(this.crequest.requestId, this.crequest).

    subscribe(res => {
      var successfull = JSON.stringify(res);
      successfull = JSON.parse(successfull).error;
      console.log(res)
      if (successfull == undefined || successfull == null) {
        loading.dismiss();
        if(value=="Fuel")
        {
          this.basicData.sendSuccessNotification("Fuel Dispensed Successfully");
        }
        if(value=="Cash")
        {
          this.basicData.sendSuccessNotification("Cash Given Successfully");
        }
        if(value=="Both")
        {
          this.basicData.sendSuccessNotification("Fuel & Cash Given Successfully");
        }

        this.navCtrl.setRoot(DsmHomePage);
      }
      else {
        loading.dismiss();
        this.basicData.sendErrorNotification(successfull);
      }

    }, err => {
      loading.dismiss();
      this.basicData.sendErrorNotification(err);
    })
  }

  
  showAlert(output)
  {
    let alert = this.alertCtrl.create({
      title: '<h1 text-center>Fuel : '+this.FuelActual+' Ltr.</h1>'+'<h1>Rs : '+output+'</h1>',
      enableBackdropDismiss: true,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            this.fuelSubmit("Fuel");
          }
        }]
        });
alert.present();

  }

  showAlertCash()
  {
    let alert = this.alertCtrl.create({
      title: '<h1 text-center>Cash Rs: '+this.crequest.cashActual+' </h1>',
      enableBackdropDismiss: true,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Confirm',
          handler: () => {
this.fuelSubmit("Cash");
          }
        }]
        });
alert.present();

  }

  showAlertFuelCash(output)
  {
    let alert = this.alertCtrl.create({
      title: '<h1 text-center>Fuel : '+this.FuelActual+' Ltr.</h1>'+'<h1>Rs : '+output+'</h1>'+'<h1 text-center>Cash Rs: '+this.crequest.cashActual+' </h1>',
      enableBackdropDismiss: true,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Confirm',
          handler: () => {
this.fuelSubmit("Both");
          }
        }]
        });
alert.present();

  }
showRates() {
  this.salesData.getProductRates(this.crequest.pumpId)
    .subscribe(res => {
      this.prodRateList = res;
    }, err => {
      this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
    })
}


home() {
  this.navCtrl.setRoot(DsmHomePage);
}

selectNozzle(selVal) {
  this.crequest.nozzleId = selVal.nozzleId;
  this.crequest.empShiftId = selVal.empShiftId;
  this.crequest.machineId = selVal.machineId;
  this.crequest.DSMId = selVal.employeeId;
  this.crequest.nozzleName = selVal.name;
  this.crequest.machineName = selVal.machineName;
  this.crequest.shortName = selVal.shortName;
  this.transporterInput = true;
  this.nozzleSelect = false;
  console.log(this.DSMList.cashRequested)
}
readQR() 
  {

  this.options = 
  {
    prompt: "Scan your QRcode "
  }

  this.brScanner.scan(this.options).then((barcodeData) => 
  {
    if (barcodeData.cancelled) 
    {
      this.basicData.sendErrorNotification("you cancelled QRCode Scanning")
      return false;
    }
    else 
    {
      console.log(barcodeData);
      this.scanData = JSON.stringify(barcodeData.text);
      this.scanData = JSON.parse(this.scanData);
      for (var i = 0; i < this.nozzleListFilter.length; i++) 
      {
        if (this.nozzleListFilter[i].QRDisplayName == this.scanData) 
        {
          this.QRnoozleList = this.nozzleListFilter[i];
        }
      }

      if (this.QRnoozleList == null) 
      {
        this.basicData.sendErrorNotification("Sorry this nozzle is not assigned to you ")
        this.scanData = null;
      }
      else 
      {
        this.selectNozzle(this.QRnoozleList);
      }
    }
  }, 
  (err) => 
  {
    console.log("Error occured : " + err);
  });

  
}
}



//add(){
  // this.crequest.invoicePhoto = this.crequest.invoiceNo + '.jpg';
  // console.log(this.crequest);
  // this.salesData.getFuelDispense(this.crequest.requestId, this.crequest).
  //   subscribe(res => {
  //     this.successfull = JSON.stringify(res);
  //     this.successfull = JSON.parse(this.successfull).error;

  //     if (this.successfull == undefined || this.successfull == null) {
  //       this.basicData.sendSuccessNotification("Fuel Dispensed successfully");
  //       this.navCtrl.setRoot(DsmHomePage);
  //     }
  //     else {
  //       this.basicData.sendErrorNotification(this.successfull);
  //     }

  //   }, err => {
  //     this.errorMsg = err;
  //     this.basicData.sendErrorNotification(err);
  //   })
//}
// let loading = this.loadingCtrl.create({
//   content: 'Please wait...',
//    enableBackdropDismiss: false,
// });
// loading.present();
// console.log(this.crequest.fuelActual, this.crequest.capacity, this.crequest.fuelRequested)
// if (this.user.valid) {
//   if (this.crequest.regNo == undefined || this.crequest.regNo == null) {
//     this.basicData.sendErrorNotification("Please select the RegNo. First");
//     loading.dismiss();
//   }
//   else {
//     if (this.crequest.fuelActual > this.crequest.fuelRequested) {
//       this.basicData.sendErrorNotification("Fuel is greater than Fuel Requested");
//       this.crequest.fuelActual = null;
//       this.crequest.invoiceNo = null;
//       loading.dismiss();
//     }
//     else if (this.crequest.fuelActual < 0) {
//       this.basicData.sendErrorNotification("Enter valid Fuel");
//       this.crequest.fuelActual = null;
//       loading.dismiss();
//     }
//     else if (this.crequest.fuelActual > this.crequest.capacity) {
//       this.basicData.sendErrorNotification("Actual Fuel is greater than its capacity");
//       this.crequest.fuelActual = null;
//       loading.dismiss();
//     }
//     else {
//       console.log(this.crequest.fuelActual, this.crequest.capacity)
//       if (this.myphoto !== undefined && this.success == undefined) {
//         this.basicData.sendErrorNotification("Image is not uploaded");
//         loading.dismiss();
//       }
//       this.crequest.updated_by = this.username;
//       this.crequest.managerId = this.managerId;
//       if (this.success == undefined || this.success == null) {
//         console.log(this.crequest);
//         this.salesData.getFuelDispense(this.crequest.requestId, this.crequest).
//           subscribe(res => {
//             this.successfull = JSON.stringify(res);
//             this.successfull = JSON.parse(this.successfull).error;

//             if (this.successfull == undefined || this.successfull == null) {
//               this.basicData.sendSuccessNotification("Fuel Dispensed successfully");
//               this.navCtrl.setRoot(DsmHomePage);
//               loading.dismiss();
//             }
//             else {
//               this.basicData.sendErrorNotification(this.successfull);
//               loading.dismiss();
//             }

//           }, err => {
//             this.errorMsg = err;
//             this.basicData.sendErrorNotification(err);
//             loading.dismiss();
//           })
//       } else {
//         this.crequest.invoicePhoto = this.crequest.invoiceNo + '.jpg';
//         console.log(this.crequest);
//         this.salesData.getFuelDispense(this.crequest.requestId, this.crequest).
//           subscribe(res => {
//             this.successfull = JSON.stringify(res);
//             this.successfull = JSON.parse(this.successfull).error;

//             if (this.successfull == undefined || this.successfull == null) {
//               this.basicData.sendSuccessNotification("Fuel Dispensed successfully");
//               this.navCtrl.setRoot(DsmHomePage);
//               loading.dismiss();
//             }
//             else {
//               this.basicData.sendErrorNotification(this.successfull);
//               loading.dismiss();
//             }

//           }, err => {
//             this.errorMsg = err;
//             this.basicData.sendErrorNotification(err);
//             loading.dismiss();
//           })
//       }
//     }
//   }
// }
// else {
//   this.user.controls['invoiceNo'].markAsTouched();
//   this.user.controls['nozzle'].markAsTouched();
//   this.user.controls['fuelActual'].markAsTouched();
//   loading.dismiss();
// }


// takePhoto() {
//   const options: CameraOptions = {
//     quality: 100,
//     targetHeight: 150,
//     targetWidth: 200,
//     destinationType: this.camera.DestinationType.DATA_URL,
//     encodingType: this.camera.EncodingType.JPEG,
//     mediaType: this.camera.MediaType.PICTURE
//   }
//   this.camera.getPicture(options).then((imageData) => {
//     this.myphoto = 'data:image/jpeg;base64,' + imageData;

//   }, (err) => {
//   });
// }


// uploadImage() {
//   if (this.myphoto == undefined) {
//     this.basicData.sendErrorNotification("Please Capture image first");
//   }
//   else {
//     //Show loading
//     let loader = this.loadingCtrl.create({
//       content: "Uploading..."
//     });
//     loader.present();
//     const fileTransfer: FileTransferObject = this.transfer.create();
//     let options: FileUploadOptions = {
//       fileKey: 'photo',
//       fileName: "myImage_" + this.crequest.invoiceNo + ".jpg",
//       chunkedMode: false,
//       httpMethod: 'post',
//       mimeType: "image/jpeg",
//       headers: {}
//     }


//     fileTransfer.upload(this.myphoto, this.apiUrl + '/storage/creditsales', options)
//       .then((data) => {
//         this.success = data;
//         this.basicData.sendSuccessNotification("Image Uploaded successfully");
//         loader.dismiss();
//       }, (err) => {

//         loader.dismiss();
//       });
//   }

// }

// showPaymode() {
  //   this.salesData.getPayMode()
  //     .subscribe(res => {
  //       this.paymodeList = res;
  //     }, err => {
  //       this.errorMsg = err;
  //       this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
  //     })
  // }

  // public onRequestChange(selVal): void {
  //   this.crequest = this.crequests.find(vehicle => vehicle.regNo = selVal);
  //   this.transporterName = this.crequest.transporterName;
  //   this.created_at = this.crequest.created_at;

  // }

  // onChangeAmount(dip1) {
  //   if (this.otp == this.crequest.otp) {
  //     console.log("hii");
  //     this.transporterInput = true;
  //     this.OTP = false;
  //   }
  //   else {
  //     this.transporterInput = false;
  //     this.OTP = true;
  //     this.otp = null;
  //     this.basicData.sendErrorNotification("OTP is Invalid")
  //   }
  // }

  // showDrivers() {
  //   this.transData.getTDrivers(this.transporterId)
  //     .subscribe(res => {
  //       this.tdriverList = res;
  //       this.tdriverList = res.filter(tdriver => tdriver.active == 1);

  //     }, err => {
  //       this.errorMsg = err;
  //       this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
  //     })
  // }

   // sendOtp() {
  //   let loading = this.loadingCtrl.create({
  //       content: 'Please wait...',         enableBackdropDismiss: true,
  //   });
  //   loading.present();
  //   this.salesData.sendOTPForBlanket(this.pumpId, this.crequest.tdriverId, this.man.regNo, this.username ).subscribe(res => {
  //     console.log(res);
  //     loading.dismiss();
  //     this.basicData.sendSuccessNotification("OTP send successfully");
  //     if(this.crequest.otp==undefined)
  //     {
  //       this.crequest.otp=res.otp;
  //     }
  //     if(this.crequest.requestId==undefined)
  //     {
  //       this.crequest.requestId = res.id;
  //     }
  //     // if(this.crequest.otp==undefined)
  //     // {

  //     // }

  //     // this.crequest.managerId = res.managerId;

  //     this.OTP=true;
  //     this.transporterdriver=false;
  //   }, err => {
  //     loading.dismiss();
  //     this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
  //   });
  //}

  // public onChange2(selVal2): void {
  //   this.crequest.tdriverId = selVal2.id;
  //   this.mobileNo = selVal2.mobileNo;
  // }

  //   public onChange3(selVal): void {
//   this.crequest.nozzleId = selVal.nozzleId;
//   this.crequest.empShiftId = selVal.empShiftId;
//   this.crequest.machineId = selVal.machineId;
//   this.crequest.DSMId = selVal.employeeId;
// }

