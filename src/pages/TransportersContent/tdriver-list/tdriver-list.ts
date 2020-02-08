import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, App, LoadingController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { TransporterPage } from '../transporter/transporter';
import { TransDataProvider } from '../../../providers/trans-data/trans-data';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';



@IonicPage()
@Component({
  selector: 'page-tdriver-list',
  templateUrl: 'tdriver-list.html',
})
export class TDriverListPage {
  transporterId: any;
  public tdriverList = [];
  public tdriverDeact = [];
  public categories = "active";
  public show: boolean = false;
  public hide: boolean = true;
  public view: boolean = true;
  public nonview: boolean = false;
  public active: number;
  public deactive: number;
  public errorMsg: any;
  constructor(public navCtrl: NavController,
    public transData: TransDataProvider,
    public platform: Platform,
    public appCtrl: App,
    public loadingCtrl:LoadingController,
    public basicData: BasicDataProvider,
    public storage: Storage,
    public navParams: NavParams) {
    let backAction = this.platform.registerBackButtonAction(() => {
     this.navCtrl.setRoot(TransporterPage);
      backAction();
    }, 1)
  }

  ionViewDidLoad() {
    //this.basicData.Loader();
    this.storage.get('transporterId').then((val) => {
      this.transporterId = val;
      let id = this.navParams.get('id');
      if (id == "deact") {
        this.categories = "deactive";
      }
      else if (id == undefined || id == null) {
        this.categories = "active";
      }
      this.showDriversList();
    },err=>{
      console.log(err);
    });
  }
  showDriversList() {
    let loading = this.loadingCtrl.create({
        content: 'Please wait...',         enableBackdropDismiss: true,
    });
    loading.present();
    this.transData.getTDrivers(this.transporterId)
      .subscribe(res => {
        loading.dismiss();
        this.tdriverList = res.filter(v => v.active == 1);
        this.tdriverDeact = res.filter(v => v.active == 0);
        this.active = this.tdriverList.length;
        this.deactive = this.tdriverDeact.length;
        if (this.tdriverList.length == 0) {
          this.show = true;
          this.hide = false;
        }
        if (this.tdriverDeact.length == 0) {
          this.nonview = true;
          this.view = false;
        }
      }, err => {
        loading.dismiss();
        this.errorMsg = err;
        this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      });
  }
  editDriver(id) {
   this.navCtrl.setRoot('TdriverEditPage', {
      param1: id
    });

  }

  addDriver() {
   this.navCtrl.setRoot('TdriverAddPage');
  }
  viewDriver(id) {
   this.navCtrl.setRoot('TdriverDeactivatePage', {
      param1: id
    });

  }
  home(){
   this.navCtrl.setRoot(TransporterPage);
  }
  doRefresh(refresher) {
    this.ionViewDidLoad();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
  menuClick() {
    this.basicData.checkTransCount();
  }
}
