import { EmployeeProfile } from './../../../app/employeeProfile';
import { Platform, LoadingController } from 'ionic-angular';
import { DsmHomePage } from './../dsm-home/dsm-home';
import { Component } from '@angular/core';
import { IonicPage, NavController, App, NavParams} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReportsProvider } from '../../../providers/reports/reports';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';
import { TransDataProvider } from '../../../providers/trans-data/trans-data';
import { DSMReports } from '../../../app/DSMReports';

/**
 * Generated class for the PumpProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dsm-profile',
  templateUrl: 'dsm-profile.html',
})
export class DsmProfilePage {
  public profile = new EmployeeProfile;
  public dsm=new DSMReports;
  other: FormGroup;
  public imgLink:any;
  public apiUrl:any;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public loadingCtrl: LoadingController,
    public reportData: ReportsProvider,
    public basicData: BasicDataProvider,
    public platform: Platform,
    public appCtrl: App,
    public transData: TransDataProvider,) {
    this.other = new FormGroup({
      email: new FormControl({ value: '' }, Validators.compose([Validators.pattern(this.emailPattern)])),
      pincode: new FormControl({ value: '' }, Validators.compose([Validators.minLength(6), Validators.maxLength(6)])),
 });
    let backAction = this.platform.registerBackButtonAction(() => {
     this.navCtrl.setRoot(DsmHomePage);
      backAction();
    }, 1)
    this.apiUrl=this.basicData.photoURl;
  }

  initCountry() {
    this.basicData.getCountries()
      .subscribe(res => {
        this.dsm.countries = res;
      }, err => {

        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      });
  }

  initRegion(countryId) {
    this.basicData.getRegions(countryId)
      .subscribe(res => {
        this.dsm.regions = res;
      }, err => {

        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      });
  }

  initCity(regionId) {
    this.basicData.getCities(regionId)
      .subscribe(res => {
        this.dsm.selectedCities = res;
      }, err => {

        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      });
  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
        content: 'Please wait...',         enableBackdropDismiss: true,
    });
    loading.present();
    this.storage.get('employeeId').then((val) => {
      this.dsm.transporterId = val;
      this.reportData.getEmployeeProfile(this.dsm.transporterId)
        .subscribe(res => {
          loading.dismiss();
          this.profile = res;
          console.log(this.profile)
          this.initCountry();
          this.initRegion(this.profile.countryId);
          this.initCity(this.profile.regionId);
        }, err => {

          this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
        })
    });
    this.storage.get('username').then((val) => {
      this.dsm.username = val;
    });
    this.storage.get('userType').then((val) => {
      this.dsm.userType = val;
    });
    this.storage.get('photo').then((val) => {
      this.dsm.userPhoto = val;
      this.imgLink=this.apiUrl+"/storage/users/"+this.dsm.userPhoto;
      console.log(this.imgLink)
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
    this.profile.updated_by = this.dsm.username;
    {
      this.reportData.updateEmployeeProfile(this.profile, this.dsm.transporterId).subscribe(res => {
        this.profile = res;
        this.basicData.sendSuccessNotification("Employee Updated Successfully");
       this.navCtrl.setRoot(DsmHomePage);
        loading.dismiss();
      }, err => {
        loading.dismiss();
        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      })
    }
  }

}
