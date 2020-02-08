// import { Component } from '@angular/core';
// import { IonicPage, App, NavController, NavParams, Platform, LoadingController } from 'ionic-angular';
// import { Storage } from '@ionic/storage';
// import { TransporterPage } from '../transporter/transporter';
// import { FormGroup, FormControl, Validators } from '@angular/forms';
// import { TransporterProfile } from '../../../app/transporterProfile';
// import { BasicDataProvider } from '../../../providers/basic-data/basic-data';
// import { TransDataProvider } from '../../../providers/trans-data/trans-data';



// @IonicPage()
// @Component({
//   selector: 'page-t-manager-profile',
//   templateUrl: 't-manager-profile.html',
// })
// export class TManagerProfilePage {
//   managerForm: FormGroup;
//   nameInput: FormControl;
//   genderInput: FormControl;
//   countryIdInput: FormControl;
//   regionIdInput: FormControl;
//   cityIdInput: FormControl;
//   mobileNoInput: FormControl;
//   other: FormGroup;
//   emailInput: FormControl;
//   pincodeInput: FormControl;
//   public tprofile = new TransporterProfile;
//   public transporterId;
//   public tprofile1: any;
//   public countryId: number;
//   public regionId: number;
//   public cityId: number;
//   public countries = [];
//   public regions = [];
//   public selectedRegions = [];
//   public cities = [];
//   public selectedCities = [];
//   public username;
//   public errorMsg;
//   emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
//   constructor(public navCtrl: NavController,
//     public navParams: NavParams,
//     public storage: Storage,
//     public appCtrl: App,
//     public platform: Platform,
//     public loadingCtrl: LoadingController,
//     public basicData: BasicDataProvider,
//     public transData: TransDataProvider
//   ) {
//     this.other = new FormGroup({
//       email: new FormControl({ value: '' }, Validators.compose([Validators.pattern(this.emailPattern)])),
//       pincode: new FormControl({ value: '' }, Validators.compose([Validators.minLength(6), Validators.maxLength(6)])),

//     });
//     let backAction = this.platform.registerBackButtonAction(() => {
//      this.navCtrl.setRoot(TransporterPage);
//       backAction();
//     }, 1)
//   }
//   createFormControls() {
//     this.countryIdInput = new FormControl("", Validators.compose([Validators.required]));
//     this.regionIdInput = new FormControl("", Validators.compose([Validators.required]));
//     this.cityIdInput = new FormControl("", Validators.compose([Validators.required]));
//     this.emailInput = new FormControl("", Validators.compose([Validators.pattern(this.emailPattern)]));
//     this.pincodeInput = new FormControl("", Validators.compose([Validators.minLength(6), Validators.maxLength(6)]));
//   }

//   createForm() {
//     this.managerForm = new FormGroup({

//       countryIdInput: this.countryIdInput,
//       regionIdInput: this.regionIdInput,
//       cityIdInput: this.cityIdInput,
//       emailInput: this.emailInput,
//       pincodeInput: this.pincodeInput,
//     });
//   }

//   ngOnInit() {
//     this.createFormControls();
//     this.createForm();
//     setTimeout(() => {
//       this.showValues();
//     }, 300);
//   }

//   showValues() {
//     this.mobileNoInput.setValue(this.tprofile.mobileNo);
//     this.emailInput.setValue(this.tprofile.email);
//     this.pincodeInput.setValue(this.tprofile.PINCode);
//     this.countryIdInput.setValue(this.tprofile.countryId);
//     this.regionIdInput.setValue(this.tprofile.regionId);
//     this.cityIdInput.setValue(this.tprofile.cityId);
//   }
//   initCountry() {
//     this.basicData.getCountries()
//       .subscribe(res => {
//         this.countries = res;
//       }, err => {

//         this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
//       });
//   }

//   initRegion(countryId) {
//     this.basicData.getRegions(countryId)
//       .subscribe(res => {
//         this.regions = res;
//       }, err => {
//         this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
//       });
//   }

//   initCity(regionId) {
//     this.basicData.getCities(regionId)
//       .subscribe(res => {
//         this.selectedCities = res;
//       }, err => {
//         this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
//       });
//   }

//   ionViewDidLoad() {
//     //this.basicData.Loader();
//     this.storage.get('tManagerId').then((val) => {
//       this.transporterId = val;
//       let loading = this.loadingCtrl.create({
//           content: 'Please wait...',         enableBackdropDismiss: true,
//       });
//       loading.present();
//       this.transData.getTManagerProfile(this.transporterId)
//         .subscribe(res => {
  
//           loading.dismiss();
//           this.tprofile = res;
//           this.initCountry();
//           this.initRegion(this.tprofile.countryId);
//           this.initCity(this.tprofile.regionId);
//         }, err => {
//           loading.dismiss();
//           this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
//         })
//     },err=>{
//       console.log(err);
//     });
//     this.storage.get('username').then((val) => {
//       this.username = val;
//     },err=>{
//       console.log(err);
//     });
//   }

//   onCountryChange(countryId) {
//     this.initRegion(countryId);
//   }

//   onRegionChange(regionId) {
//     this.initCity(regionId);
//   }

//   onCityChange(cityId) {
//   }

//   editTProfile() {
//     let loading = this.loadingCtrl.create({
//         content: 'Please wait...',         
//         enableBackdropDismiss: true,
//     });
//     loading.present();
//     this.tprofile.updated_by = this.username;
//     {
//       this.transData.updateTManagerProfile(this.tprofile, this.transporterId).subscribe(res => {
//         this.tprofile = res;
//         this.basicData.sendSuccessNotification("Transporter Updated Successfully");
//        this.navCtrl.setRoot(TransporterPage);
//         loading.dismiss();
//       }, err => {
//         loading.dismiss();
//         this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
//       })
//     }
//   }

//   home() {
//     this.navCtrl.setRoot(TransporterPage);
//   }
//   menuClick() {
//     this.basicData.checkTransCount();
//   }
// }

import { TransporterPage } from './../transporter/transporter';
import { Component } from '@angular/core';
import { IonicPage, App, NavController, NavParams, Platform, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TransporterProfile } from '../../../app/transporterProfile';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';
import { TransDataProvider } from '../../../providers/trans-data/trans-data';
/**
 * Generated class for the TransporterProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-t-manager-profile',
    templateUrl: 't-manager-profile.html',
  })
export class TManagerProfilePage {
  other: FormGroup;
  public tprofile = new TransporterProfile;
  public transporterId;
  public tprofile1: any;
  public userPhoto:any;
  public countryId: number;
  public regionId: number;
  public cityId: number;
  public imgLink:any;
  public name:string;
  public apiUrl:any;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  public countries = [];
  public regions = [];
  public selectedRegions = [];
  public cities = [];
  public selectedCities = [];
  public username;
  public errorMsg;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public appCtrl: App,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public basicData: BasicDataProvider,
    public transData: TransDataProvider
  ) {
    this.other = new FormGroup({
      email: new FormControl({ value: '' }, Validators.compose([Validators.pattern(this.emailPattern)])),
      pincode: new FormControl({ value: '' }, Validators.compose([Validators.minLength(6), Validators.maxLength(6)])),

    });
    let backAction = this.platform.registerBackButtonAction(() => {
     this.navCtrl.setRoot(TransporterPage);
      backAction();
    }, 1)
    this.apiUrl=this.basicData.photoURl;
  //  this.imgLink=this.apiUrl+"/storage/users/"+this.userPhoto;
  }

  initCountry() {
    this.basicData.getCountries()
      .subscribe(res => {
        this.countries = res;
      }, err => {

        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      });
  }

  initRegion(countryId) {
    this.basicData.getRegions(countryId)
      .subscribe(res => {
        this.regions = res;
      }, err => {

        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      });
  }

  initCity(regionId) {
    this.basicData.getCities(regionId)
      .subscribe(res => {
        this.selectedCities = res;
      }, err => {

        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      });
  }

  ionViewDidLoad() {     //this.basicData.Loader();
    let loading = this.loadingCtrl.create({
        content: 'Please wait...',         enableBackdropDismiss: true,
    });
    loading.present();
    this.storage.get('tManagerId').then((val) => {
      this.transporterId = val;
      this.transData.getTManagerProfile(this.transporterId)
        .subscribe(res => {
  
          this.tprofile = res;
          console.log(res);
          loading.dismiss();
          this.initCountry();
          this.initRegion(this.tprofile.countryId);
          this.initCity(this.tprofile.regionId);
        }, err => {
loading.dismiss();
          this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
        })
    });
    this.storage.get('username').then((val) => {
      this.username = val;
    },err=>{
      console.log(err);
    });
    this.storage.get('name').then((val) => {
      this.name = val;
    },err=>{
      console.log(err);
    });
    this.storage.get('photo').then((val) => {
      this.userPhoto = val;
      this.imgLink=this.apiUrl+"/storage/users/"+this.userPhoto;
      console.log(this.imgLink)
    },err=>{
      console.log(err);
    });
  }
  onCountryChange(countryId) {
    this.initRegion(countryId);
  }

  onRegionChange(regionId) {
    this.initCity(regionId);
  }

  onCityChange(cityId) {
  }
  
  editTProfile() {
    this.tprofile.updated_by = this.username;
    let loading = this.loadingCtrl.create({
        content: 'Please wait...',         enableBackdropDismiss: true,
    });
    loading.present();
    {
      this.transData.updateTransporterProfile(this.tprofile, this.transporterId).subscribe(res => {
        this.tprofile = res;
        this.basicData.sendSuccessNotification("Profile Updated Successfully");
       this.navCtrl.setRoot(TransporterPage);
        loading.dismiss();
      }, err => {

        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
        loading.dismiss();
      })
    }
  }
  home() {
    this.navCtrl.setRoot(TransporterPage);
  }
  menuClick() {
    this.basicData.checkTransCount();
  }
}

