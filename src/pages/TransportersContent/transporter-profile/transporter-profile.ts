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
  selector: 'page-transporter-profile',
  templateUrl: 'transporter-profile.html',
})
export class TransporterProfilePage {
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
    this.storage.get('transporterId').then((val) => {
      this.transporterId = val;
      this.transData.getTransporterProfile(this.transporterId)
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
