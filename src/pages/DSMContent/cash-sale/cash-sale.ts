import { BasicDataProvider } from './../../../providers/basic-data/basic-data';
import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, App, Platform, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DsmHomePage } from '../dsm-home/dsm-home';
import { FormControl } from '@angular/forms';
import { FormGroup, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
import { CashSale } from '../../../app/cash.sale';
import { Driver } from '../../../app/driver';
import { SalesDataProvider } from '../../../providers/sales-data/sales-data';
import { DSMReports } from '../../../app/DSMReports';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';

@IonicPage()
@Component({
  selector: 'page-cash-sale',
  templateUrl: 'cash-sale.html',
})
export class CashSalePage {
  user: FormGroup;
  other: FormGroup;
  scanData: any;
  options: BarcodeScannerOptions;
  public cashsale = new CashSale;
  public dsm = new DSMReports;
  query: number;

  filterNumber: number;
  public drivers: Driver[];
  driversList: any[];
  driversList1: any[];
  encodeData: string;
  encodedData: {};
  noozleList: any;
  qrData: any;
  FuelActual:any;
  Amount:any
  createdCode: null;
  scannedCode: any;
  constructor(
    public platform: Platform,
    public basicData: BasicDataProvider,
    public salesData: SalesDataProvider,
    private camera: Camera,
    public navCtrl: NavController,
    public appCtrl: App,
    public brScanner: BarcodeScanner,
    public alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private transfer: FileTransfer,
    public storage: Storage) {
    this.cashsale.invoiceNo = "";
    this.cashsale.vehicleNo = "";

    this.user = new FormGroup({
      amount: new FormControl({ value: '' }, Validators.compose([Validators.required])),
     invoiceNo: new FormControl({ value: '' }, 
     Validators.compose([Validators.required,Validators.maxLength(10),  
     Validators.pattern('[0-9]*')])),
      quantity: new FormControl({ value: '' }, Validators.compose([Validators.required])),

    });
    this.other = new FormGroup({
      vehicleNo: new FormControl({ value: '' }, Validators.compose([Validators.required, Validators.maxLength(20), Validators.pattern('[a-zA-Z0-9]*')])),
    });
    this.dsm.apiUrl = this.basicData.photoURl;
    let backAction = this.platform.registerBackButtonAction(() => {
      this.navCtrl.setRoot(DsmHomePage);
      backAction();
    }, 1)
  }

  ionViewDidLoad() {

    this.storage.get('pumpId').then((val) => {
      this.cashsale.pumpId = val;
      this.showDrivers();
    }, err => {
      console.log(err);
    });
    this.storage.get('employeeId').then((val) => {
      this.cashsale.DSMId = val;
      this.showPaymode();
    }, err => {
      console.log(err);
    });

    this.storage.get('empShiftId').then((val) => {
      this.cashsale.empShiftId = val;
    }, err => {
      console.log(err);
    });
    this.storage.get('username').then((val) => {
      this.cashsale.updated_by = val;
      this.showNoozle();
    }, err => {
      console.log(err);
    });
    this.storage.get('managerId').then((val) => {
      this.cashsale.managerId = val;
    }, err => {
      console.log(err);
    });

  }

  onChangeTime(dip1) {
    console.log(this.cashsale.fuelCapacity,dip1)
    if (dip1 >parseFloat(this.cashsale.fuelCapacity)) {
      this.basicData.sendErrorNotification("Fuel is greater than its capacity");
      this.cashsale.quantity = null;
      this.cashsale.amount = null;
    }
    else {
      this.cashsale.amount = this.cashsale.quantity * this.cashsale.currentRate;
      this.dsm.toFix = this.cashsale.amount;
      this.cashsale.amount = this.dsm.toFix.toFixed(2);
    }

  }

  onInputTime() {
  }

  onChangeAmount(dip1) {
    this.cashsale.quantity = this.cashsale.amount / this.cashsale.currentRate;
    if (this.cashsale.quantity > parseFloat(this.cashsale.fuelCapacity))
     {
      this.basicData.sendErrorNotification("Fuel is greater than its capacity");
      this.cashsale.quantity = null;
      this.cashsale.amount = null;
    }
    else {
      this.dsm.toFix = this.cashsale.quantity;
      this.cashsale.quantity = this.dsm.toFix.toFixed(2);
    }

  }

  showDrivers() {
    this.salesData.gelLoyaltyDriver(this.cashsale.pumpId)
      .subscribe(res => {
        this.driversList = res;
        this.drivers = res;
        console.log(res);
        var j = this.driversList.length;
        console.log(res, j)

        //  for (var i = 0; i < this.driversList.length; i++) {
        //   this.driversList[i] = this.drivers[i].driverMobileNo;
        //   // this.driversList[j+i] = this.drivers[i].driverMobileNo;
        //   }

      }, err => {

        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      });
  }

  addCashSale() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...', enableBackdropDismiss: true,
    });
    loading.present();
    if (this.dsm.cb_vehicelchanged == true) {
      if (this.other.valid) {
        if (this.dsm.success == undefined) {
          loading.dismiss();
          let alert = this.alertCtrl.create({
            // title: 'Confirm purchase',

            message: 'Image is not uploaded do you really want to proceed?',
            enableBackdropDismiss: true,
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',

                handler: () => {
                }
              },
              {
                text: 'Ok',
                handler: () => {
                  let loading = this.loadingCtrl.create({
                    content: 'Please wait...', enableBackdropDismiss: true,
                  });
                  loading.present();
                  if (this.user.valid) {
                    this.cashsale.vehicleChanged = this.dsm.cb_vehicelchanged;
                    this.Amount=this.cashsale.amount;
                    this.Amount=parseFloat(this.Amount).toFixed(2);
                    this.FuelActual=this.cashsale.quantity;
                    this.FuelActual=parseFloat(this.FuelActual).toFixed(2);
                   // var Fuel=parseFloat(this.crequest.fuelActual).toFixed(2);
               
               
                   this.Amount=parseFloat( this.Amount).toFixed(2);
                   var result =  this.Amount.toString().split('.');
                   var lastThree = result[0].substring(result[0].length - 3);
                   var otherNumbers = result[0].substring(0, result[0].length - 3);
                   if (otherNumbers != '' && otherNumbers != '-')
                       lastThree = ',' + lastThree;
                   var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;


                     let alert = this.alertCtrl.create({
                       title: '<h1 text-center>Fuel : '+this.FuelActual+' Ltr.</h1>'+'<h1>Rs : '+output+'</h1>',
                       enableBackdropDismiss: true,
                       buttons: [
                         {
                           text: 'Cancel',
                           role: 'cancel',
                           handler: () => {
                            loading.dismiss();
                           }
                         },
                         {
                           text: 'Confirm',
                           handler: () => {
                            let loading = this.loadingCtrl.create({
                              content: 'Please wait...', enableBackdropDismiss: true,
                            });
                            loading.present();
                    this.salesData.addCashSale(this.cashsale).subscribe
                      (res => {
                        loading.dismiss();
                        var successfull = JSON.stringify(res);
                        successfull = JSON.parse(successfull).error;
                        if (successfull == undefined || successfull == null) {
                          this.basicData.sendSuccessNotification("Cash Loyality Added Successfully");
                          this.navCtrl.setRoot(DsmHomePage);
                          loading.dismiss();
                        }
                        else {
                          this.basicData.sendErrorNotification(successfull);
                          loading.dismiss();
                        }
                      }, err => {

                        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
                        loading.dismiss();

                      })
                    }
                  }
                    ]
                  });
                  alert.present();
                      }
                  else {
console.log("1")
                    this.user.controls['amount'].markAsTouched();
                    this.user.controls['invoiceNo'].markAsTouched();
                    loading.dismiss();
                  }
                }
              }
            ]
          });
          alert.present();
        if (this.user.valid) {
          this.cashsale.vehicleChanged = this.dsm.cb_vehicelchanged;
          this.cashsale.vehiclePhoto = this.cashsale.vehicleNo + '.jpg';

          var amount=this.cashsale.amount;
          this.Amount=this.cashsale.amount;
          this.Amount=parseFloat(this.Amount).toFixed(2);
          this.FuelActual=this.cashsale.quantity;
          this.FuelActual=parseFloat(this.FuelActual).toFixed(2);
         // var Fuel=parseFloat(this.crequest.fuelActual).toFixed(2);
     
         this.Amount=parseFloat( this.Amount).toFixed(2);
         var result =  this.Amount.toString().split('.');
         var lastThree = result[0].substring(result[0].length - 3);
         var otherNumbers = result[0].substring(0, result[0].length - 3);
         if (otherNumbers != '' && otherNumbers != '-')
             lastThree = ',' + lastThree;
         var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

     
           let alert = this.alertCtrl.create({
             title: '<h1 text-center>Fuel : '+this.FuelActual+' Ltr.</h1>'+'<h1>Rs : '+output+'</h1>',
             enableBackdropDismiss: true,
             buttons: [
               {
                 text: 'Cancel',
                 role: 'cancel',
                 handler: () => {
                  loading.dismiss();
                 }
               },
               {
                 text: 'Confirm',
                 handler: () => {
                  let loading = this.loadingCtrl.create({
                    content: 'Please wait...', enableBackdropDismiss: true,
                  });
                  loading.present();

          this.salesData.addCashSale(this.cashsale).
            subscribe(res => {
              
              var successfull = JSON.stringify(res);
              successfull = JSON.parse(successfull).error;
              if (successfull == undefined || successfull == null) {
                loading.dismiss();
                this.basicData.sendSuccessNotification("Cash Loyalty Added Successfully");
                this.navCtrl.setRoot(DsmHomePage);
              }
              else {
                this.basicData.sendErrorNotification(successfull);
                loading.dismiss();
              }
            }, err => {

              this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!" + err);
              loading.dismiss();
            })
          }
        }
        ]
      });
      alert.present();

    }
            
        }
        else {
          console.log("2")
          this.user.controls['amount'].markAsTouched();
          this.user.controls['invoiceNo'].markAsTouched();
          loading.dismiss();
        }
      }
      else {
        this.other.controls['vehicleNo'].markAsTouched();
        loading.dismiss();
      }
    }
    else {
      if (this.user.valid) {
        this.cashsale.vehicleChanged = this.dsm.cb_vehicelchanged;
        
        this.Amount=this.cashsale.amount;
        this.Amount=parseFloat(this.Amount).toFixed(2);
        this.FuelActual=this.cashsale.quantity;
        this.FuelActual=parseFloat(this.FuelActual).toFixed(2);
       // var Fuel=parseFloat(this.crequest.fuelActual).toFixed(2);
   
       this.Amount=parseFloat( this.Amount).toFixed(2);
       var result =  this.Amount.toString().split('.');
       var lastThree = result[0].substring(result[0].length - 3);
       var otherNumbers = result[0].substring(0, result[0].length - 3);
       if (otherNumbers != '' && otherNumbers != '-')
           lastThree = ',' + lastThree;
       var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
   
         let alert = this.alertCtrl.create({
           title: '<h1 text-center>Fuel : '+this.FuelActual+' Ltr.</h1>'+'<h1>Rs : '+output+'</h1>',
           enableBackdropDismiss: true,
           buttons: [
             {
               text: 'Cancel',
               role: 'cancel',
               handler: () => {
                loading.dismiss();
               }
             },
             {
               text: 'Confirm',
               handler: () => {
                let loading = this.loadingCtrl.create({
                  content: 'Please wait...', enableBackdropDismiss: true,
                });
                loading.present();

        this.salesData.addCashSale(this.cashsale).subscribe
          (res => {
            var successfull = JSON.stringify(res);
            successfull = JSON.parse(successfull).error;
            if (successfull == undefined || successfull == null) {
              this.basicData.sendSuccessNotification("Cash Loyalty Added Successfully");
              this.navCtrl.setRoot(DsmHomePage);
              loading.dismiss();
            }
            else {
              this.basicData.sendErrorNotification(successfull);
              loading.dismiss();
            }
          }, err => {

            this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!" + err);
            loading.dismiss();

          })
      }
    }
    ]
  });
  alert.present();
      }
      else {
        console.log("3")
        loading.dismiss();
        this.user.controls['amount'].markAsTouched();
        this.user.controls['invoiceNo'].markAsTouched();
      }
    }
  }

  filter() {
    this.filterNumber = null;
    this.scanData = null;
    this.noozleList = null;
    for (var i = 0; i < this.drivers.length; i++) {
      if (this.driversList[i] == this.query) {
        this.filterNumber = this.query;
      }
      //this.select(querry);
    }
    if (this.filterNumber == null) {
      this.dsm.showEmpty = true;

      console.log("hii");
      this.cashsale.selectNozzle = false;
      this.cashsale.detail = false;
    }
    else {
      this.dsm.showEmpty = false;
      console.log("l");
      this.select(this.filterNumber);
    }
  }

  select(item) {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...', enableBackdropDismiss: true,
    });
    loading.present();
    this.query = item;
    this.salesData.getCashDriverRequest(this.cashsale.pumpId, this.query)
      .subscribe(res => {
        loading.dismiss();
        console.log(res);
        this.query = null;
        this.dsm.selectp = false;
        this.cashsale.selectNozzle = true;
        this.cashsale.detail = true;
        this.dsm.selectList = res;
        this.cashsale.fuelCapacity= this.dsm.selectList.fuelCapacity;
        this.cashsale.driverMobileNo = this.dsm.selectList.driverMobileNo;
        this.cashsale.pumpId = this.dsm.selectList.pumpId;
       // this.cashsale.updated_by = this.dsm.selectList.updated_by;
        this.cashsale.vehicleNo = this.dsm.selectList.vehicleNo;
      }, err => {
        this.cashsale.selectNozzle = false;
        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      });
  }

  showPaymode() {
    this.salesData.getPayMode()
      .subscribe(res => {
        this.dsm.paymodeList = res;
      }, err => {

        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      })
  }

  showNoozle() {
    this.salesData.getDSMNozzles(this.cashsale.pumpId, this.cashsale.DSMId, this.dsm.isTotalizer)
      .subscribe(res => {
        this.dsm.nozzleList = res;
        this.dsm.nozzleListFilter = res;
        console.log(this.dsm.nozzleListFilter)
      }, err => {

        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      })
  }

  selectPaymodeList(id) {
    this.cashsale.payModeId = id;
  }

  selectNozzleList(noozleList) {
    console.log(noozleList)
    this.cashsale.nozzleId = noozleList.nozzleId;
    this.cashsale.empShiftId = noozleList.empShiftId;
    this.cashsale.machineId = noozleList.machineId;
    this.cashsale.DSMId = noozleList.employeeId;
    this.cashsale.unitName = noozleList.unitName;
    this.cashsale.currentRate = noozleList.currentRate;
    this.cashsale.machineName = noozleList.machineName;
    this.cashsale.nozzleName = noozleList.name;
    this.cashsale.shortName = noozleList.shortName;
    this.dsm.productName = noozleList.productName;
    this.dsm.showProductboolean = true;
    this.dsm.selectp = true;
    this.cashsale.selectNozzle = false;

    if (this.cashsale.amount !== undefined || this.cashsale.quantity !== undefined) {
      this.cashsale.amount = null;
      this.cashsale.quantity = null;
      this.cashsale.invoiceNo = null;
    }
  }

  vehcileChanged() {
    if (this.dsm.cb_vehicelchanged == false) {
      this.dsm.hideTakePhotoButton = false;
    }
    else {
      this.dsm.hideTakePhotoButton = true;
    }
  }

  takePhoto() {
    const options: CameraOptions = {
      quality: 100,
      targetHeight: 150,
      targetWidth: 200,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {

      this.dsm.myphoto = 'data:image/jpeg;base64,' + imageData;

    }, (err) => {
      // Handle error
    });
  }

  uploadImage() {
    if (this.dsm.myphoto == undefined) {
      this.basicData.sendErrorNotification("Please Capture image first");

    }
    else {
      if (this.cashsale.vehicleNo == null || this.cashsale.vehicleNo == undefined) {

        this.basicData.sendErrorNotification("Please Enter vehicle No");
      }
      else {

        let loader = this.loadingCtrl.create({
          content: "Uploading..."
        });
        loader.present();
        //create file transfer object
        const fileTransfer: FileTransferObject = this.transfer.create();
        //random int
        //var random = Math.floor(Math.random() * 100);
        //option transfer
        let options: FileUploadOptions = {

          fileKey: 'photo',
          fileName: "myImage_" + this.cashsale.vehicleNo + ".jpg",
          chunkedMode: false,
          httpMethod: 'post',
          mimeType: "image/jpeg",
          headers: {}
        }

        fileTransfer.upload(this.dsm.myphoto, this.dsm.apiUrl + '/storage/loyaltysales', options)
          .then((data) => {
            this.dsm.success = data;
            this.basicData.sendSuccessNotification("Image uploaded Successfully");
            loader.dismiss();
          }, (err) => {
            loader.dismiss();
            this.basicData.sendErrorNotification("Image is not uploaded" + err);
          });
      }
    }

  }

  home() {
    this.navCtrl.setRoot(DsmHomePage);
  }

  readQR() {
    console.log("readQR");
    this.options = {
      prompt: "Scan your QRcode "
    }
    this.brScanner.scan(this.options).then((barcodeData) => {
      if (barcodeData.cancelled) {
        this.basicData.sendErrorNotification("You Cancelled QRCode Scanning")
        return false;
      }
      else {
        console.log(barcodeData);
        this.scanData = JSON.stringify(barcodeData.text);
        this.scanData = JSON.parse(this.scanData);
        for (var i = 0; i < this.dsm.nozzleList.length; i++) {
          if (this.dsm.nozzleList[i].QRDisplayName == this.scanData) {
            this.noozleList = this.dsm.nozzleList[i];
          }
        }
        if (this.noozleList == null) {
          this.basicData.sendErrorNotification("Sorry this nozzle is not assigned to you ")
          this.scanData = null;
        }
        else {
          this.selectNozzleList(this.noozleList);
        }
      }
    }, (err) => {
      console.log("Error occured : " + err);
    });

  }

}
