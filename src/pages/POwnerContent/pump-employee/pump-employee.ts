import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, App, NavController, NavParams, Platform, LoadingController } from 'ionic-angular';
import { POwnerHomePage } from '../p-owner-home/p-owner-home';
import { PumpDataProvider } from '../../../providers/pump-data/pump-data';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';
import { PManagerHomePage } from '../../PMAnagerContent/p-manager-home/p-manager-home';

/**
 * Generated class for the PumpEmployeePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pump-employee',
  templateUrl: 'pump-employee.html',
})
export class PumpEmployeePage {
  public pumpId: number;
  pumpList: any[] = [];
  pumpList1: any[] = [];
  searchTerm: string = '';
  searchTerm1: string = '';
  searchTerm2: string = '';
  public categories = "active";
  public userType:any;
  public pumpListDeact = [];
  public show: boolean = false;
  public hide: boolean = true;
  public view: boolean = true;
  public nonview: boolean = false;
  public active: number;
  public username:string;
  public deactive: number;
  constructor(public navCtrl: NavController,
    public appCtrl: App,
    public loadingCtrl:LoadingController,
    public storage: Storage,
    public laodingCtrl:LoadingController,
    public basicData:BasicDataProvider,
    public platform: Platform,
    public navParams: NavParams,
    public pumpData: PumpDataProvider) {
    let backAction = this.platform.registerBackButtonAction(() => {
      if(this.userType==11){this.appCtrl.getRootNavs()[0].push(POwnerHomePage);}

      else if(this.userType==12) {this.appCtrl.getRootNavs()[0].push(PManagerHomePage);}
      backAction();
    }, 1)
  }

  ionViewDidLoad() {
console.log("Categories"+this.categories);
    this.storage.get('pumpId').then((val) => {
      this.pumpId = val;
    
    },err=>{
      console.log(err);
    });
    this.storage.get('userType').then((val) => {
      this.userType = val;
    },err=>{
      console.log(err);
    });
    this.storage.get('username').then((val) => {
      this.username = val;
      this.getEmployeeList();
    },err=>{
      console.log(err);
    });
    let id = this.navParams.get('id');
    if (id == "deact") {
      this.categories = "deactive";
    }
    else if (id == undefined || id == null) {
      this.categories = "active";
    }
  }

  filter() {
    this.pumpListDeact = this.filterItems(this.searchTerm);
    console.log(this.pumpListDeact);
    if(this.searchTerm=="")
    {
      this.pumpListDeact = this.pumpList1.filter(v => v.active == 0);
    }
  }

  filterItems(searchTerm) {
    return this.pumpListDeact.filter((item) => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });

  }

  filter1() {
    this.pumpList = this.filterItems1(this.searchTerm1);
    console.log(this.pumpList);
    if(this.searchTerm1=="")
    {
      this.pumpList = this.pumpList1.filter(v => v.active == 1);
    }
  }

  filterItems1(searchTerm) {
    return this.pumpList.filter((item) => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });

  }


  PumpEmployeeDetailsPage(event) {
   this.navCtrl.setRoot('PumpEmployeeDetailsPage', {
      param1: event
    });
  }
  getEmployeeList() {
    let loading = this.loadingCtrl.create({
        content: 'Please wait...',         enableBackdropDismiss: true,
    });
    loading.present();
    this.pumpData.getEmployeeList(this.pumpId,this.username).subscribe(res => {
      loading.dismiss();
      this.pumpList1 = res;
      this.pumpList = res.filter(v => v.active == 1);
      this.pumpListDeact = res.filter(v => v.active == 0);
      this.active = this.pumpList.length;
      this.deactive = this.pumpListDeact.length;
      if (this.pumpList.length == 0) {
        this.show = true;
        this.hide = false;
      }
      if (this.pumpListDeact.length == 0) {
        this.nonview = true;
        this.view = false;
      }
    }, err => {

      this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      loading.dismiss();
    }
    )
  }
  home() {
    if(this.userType==11){this.appCtrl.getRootNavs()[0].push(POwnerHomePage);}

    else if(this.userType==12) {this.appCtrl.getRootNavs()[0].push(PManagerHomePage);}
  }
  menuClick() {
    this.basicData.checkPumpCount();
  }
  doRefresh(refresher) {
    this.ionViewDidLoad();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
}
