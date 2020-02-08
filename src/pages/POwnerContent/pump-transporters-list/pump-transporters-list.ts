import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, App, NavController, NavParams, LoadingController } from 'ionic-angular';
import { POwnerHomePage } from '../p-owner-home/p-owner-home';
import { TransDataProvider } from '../../../providers/trans-data/trans-data';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';

/**
 * Generated class for the PumpTransportersListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pump-transporters-list',
  templateUrl: 'pump-transporters-list.html',
})
export class PumpTransportersListPage {
  public pumpId: number;
  pumpList: any[] = [];
  nondefaulterList: any[] = [];
  defaulterList: any[] = [];
  activePumpList: any[] = [];
  deactivePumpList: any[] = [];
  searchTerm: string = '';
  searchTerm1: string = '';
  searchTerm2: string = '';
  length:any;
  items: any;
  public categories = "active";
  public activeCount: number;
  public deactiveCount: number;
  public defaulterCount: number;
  public pumpListDeact = [];
  public show: boolean = false;
  public hide: boolean = true;
  public view: boolean = true;
  public nonview: boolean = false;
  public def: boolean = true;
  public nondef: boolean = false;
  public active: number;
  public deactive: number;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl:LoadingController,
    public appCtrl: App,
    public basicData:BasicDataProvider,
    public storage: Storage,
    public transData: TransDataProvider) {
  }

  ionViewDidLoad() {
    this.storage.get('pumpId').then((val) => {
      this.pumpId = val;
      this.showPumpList();
    },err=>{
      console.log(err);
    });
    let id = this.navParams.get('id');
    if (id == "deact") {
      this.categories = "deactive";
    }
    else if (id == "default") {
      this.categories = "defaulter";
    }
    else if (id == undefined || id == null) {
      this.categories = "active";
    }
  }

  filter() {
    this.activePumpList = this.filterItems(this.searchTerm);
    console.log(this.activePumpList,this.searchTerm);
    if(this.searchTerm=="")
    {
      this.activePumpList = this.nondefaulterList.filter(v => v.active == 1);
    }
  }

  filterItems(searchTerm) {
    return this.activePumpList.filter((item) => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
    

  }
  filter1() {
    this.deactivePumpList = this.filterItems1(this.searchTerm1);
    console.log(this.deactivePumpList);
    if(this.searchTerm1=="")
    {
      this.deactivePumpList = this.nondefaulterList.filter(v => v.active == 0);
    }
  }

  filterItems1(searchTerm) {
    return this.deactivePumpList.filter((item) => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });

  }
  filter2() {
    this.defaulterList = this.filterItems2(this.searchTerm2);
    console.log(this.defaulterList);
    if(this.searchTerm2=="")
    {
      this.defaulterList = this.pumpList.filter(v => v.defaulter == 1);
    }
  }

  filterItems2(searchTerm) {
    return this.defaulterList.filter((item) => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });

  }


  home() {
   this.navCtrl.setRoot(POwnerHomePage);
  }

  showPumpList() {
    let loading = this.loadingCtrl.create({
        content: 'Please wait...',         enableBackdropDismiss: true,
    });
    loading.present();
    this.transData.getTransporters(this.pumpId).subscribe(res => {
      loading.dismiss();
      this.pumpList = res;
      this.nondefaulterList = this.pumpList.filter(v => v.defaulter == 0);
      this.defaulterList = this.pumpList.filter(v => v.defaulter == 1);
      this.activePumpList = this.nondefaulterList.filter(v => v.active == 1);
      this.deactivePumpList = this.nondefaulterList.filter(v => v.active == 0);
      this.activeCount = this.activePumpList.length;
      this.deactiveCount = this.deactivePumpList.length;
      this.defaulterCount = this.defaulterList.length;
      if (this.activePumpList.length == 0) {
        this.show = true;
        this.hide = false;
      }
      if (this.deactivePumpList.length == 0) {
        this.nonview = true;
        this.view = false;
      }
      if (this.defaulterList.length == 0) {
        this.def = false;
        this.nondef = true;
      }
    }, err => {

      this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      loading.dismiss();
    })
  }
  PumpTransporterDetailsPage(id) {
   this.navCtrl.setRoot("PumpTransporterDetailsPage", {
      param: id
    });
  }

  doRefresh(refresher) {
    this.ionViewDidLoad();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
  menuClick() {
    this.basicData.checkPumpCount();
  }
}
