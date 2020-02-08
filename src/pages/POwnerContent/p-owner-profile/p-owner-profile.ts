
import { Component } from '@angular/core';
import { IonicPage, App, NavController, NavParams, Platform, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { POwnerHomePage } from '../p-owner-home/p-owner-home';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EmployeeProfile } from '../../../app/employeeProfile';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';
import { ReportsProvider } from '../../../providers/reports/reports';
import { TransDataProvider } from '../../../providers/trans-data/trans-data';


@IonicPage()
@Component({
  selector: 'page-p-owner-profile',
  templateUrl: 'p-owner-profile.html',
})
export class POwnerProfilePage {
  other: FormGroup;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  public profile = new EmployeeProfile;
  public pumpId:number;;
  public countryId: number;
  public regionId: number;
  public cityId: number;
  public userType: any;
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
    public platform: Platform,
    public appCtrl: App,
    public loadingCtrl: LoadingController,
    public basicData: BasicDataProvider,
    public reportData: ReportsProvider,
    public transData: TransDataProvider,) {
    this.other = new FormGroup({
      email: new FormControl({ value: '' }, Validators.compose([Validators.pattern(this.emailPattern)])),
      pincode: new FormControl({ value: '' }, Validators.compose([Validators.minLength(6), Validators.maxLength(6)])),

    });
    let backAction = this.platform.registerBackButtonAction(() => {
     this.navCtrl.setRoot(POwnerHomePage);
      backAction();
    }, 1)
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

  ionViewDidLoad() {
    //this.basicData.Loader();
    let loading = this.loadingCtrl.create({
        content: 'Please wait...',         enableBackdropDismiss: true,
    });
    loading.present();
    this.storage.get('pumpId').then((val) => {
      this.pumpId = val;
      this.reportData.getPumpOwnerProfile(this.pumpId)
        .subscribe(res => {
          this.profile = res;
          console.log(res);
loading.dismiss();
          this.initCountry();
          this.initRegion(this.profile.countryId);
          this.initCity(this.profile.regionId);
        }, err => {
loading.dismiss();
          this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
        })
    });
    this.storage.get('username').then((val) => {
      this.username = val;
    });
    this.storage.get('userType').then((val) => {
      this.userType = val;
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
    let loading = this.loadingCtrl.create({
        content: 'Please wait...',         enableBackdropDismiss: true,
    });
    loading.present();
    this.profile.updated_by = this.username;
    {
      console.log(this.profile)
      this.reportData.updatePumpOwnerProfile(this.profile, this.pumpId).subscribe(res => {
        this.profile = res;
 
        this.basicData.sendSuccessNotification("Employee Updated Successfully");
       this.navCtrl.setRoot(POwnerHomePage);
        loading.dismiss();
      }, err => {

        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
        loading.dismiss();
      })
    }
  }
  home() {
   this.navCtrl.setRoot(POwnerHomePage)

  }
  menuClick() {
    this.basicData.checkPumpCount();
  }
}
