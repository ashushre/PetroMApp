import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, App, NavController, NavParams } from 'ionic-angular';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';
import { SmsDataProvider } from '../../../providers/sms-data/sms-data';
import { POwnerHomePage } from '../../POwnerContent/p-owner-home/p-owner-home';
import { PManagerHomePage } from '../../PMAnagerContent/p-manager-home/p-manager-home';
import { ReportsProvider } from '../../../providers/reports/reports';
import { Reports } from '../../../app/reports';


/**
 * Generated class for the SmsReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sms-report',
  templateUrl: 'sms-report.html',
})
export class SmsReportPage {
  username: String;
  password: String;
  SmsData: any;
  SmsHistory: any[]=[];
  SmsRemained: number;
  name: any;
  pumpId: number;
  public userType: number;
  show:boolean;
  success: any;
  myStr: any;
  error: any;
  constructor(public navCtrl: NavController, public basicData: BasicDataProvider,
    public reportData: ReportsProvider,
    public appCtrl: App, public navParams: NavParams, public service: SmsDataProvider,
    public dataService: SmsDataProvider, public storage: Storage) {
  }

  ionViewDidLoad() {


    this.storage.get('userType').then((val) => {
      this.userType = val;
    }, err => {
      console.log(err);
    });
    this.storage.get('smsUsername').then((val) => {
      this.username = val;
      console.log(val);
    }, err => {
      console.log(err);
    });
    this.storage.get('smsPassword').then((val) => {
      this.password = val;
      console.log(val);

    }, err => {
      console.log(err);
    });
    this.storage.get('pumpId').then((val) => {
      this.pumpId = val;
      this.reportData.getSmsCount(this.pumpId).subscribe(res => {
        console.log(res);
        this.SmsData = res.purchaseCount;
        this.SmsHistory = res.smshistory;
        console.log(this.SmsHistory[0].amount);
        if(this.SmsHistory[0].amount=='Free')
        {
          this.show=false;
        }
        else{
          this.show=true;
        }
        this.getUserInfo()
      })
    }, err => {
      console.log(err);
    });

  }


  getUserInfo() {
    this.dataService.checkUser(this.username, this.password).then(data => {
      this.success = JSON.stringify(data);
      this.myStr = this.success;
      this.myStr = this.myStr.replace('"Success#Promotional:0|Transactoinal:','')
      this.myStr = this.myStr.replace('"','');
      parseFloat(this.myStr);
      console.log(this.myStr,this.success);
      this.SmsRemained = parseFloat(this.SmsData) - parseFloat(this.myStr);
      console.log(this.SmsRemained, this.myStr,this.SmsData)
    }, err => {

      this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
    })
  }
  home() {
    if (this.userType == 11) {
      this.navCtrl.setRoot(POwnerHomePage)
    }
    else if (this.userType == 12) {
      this.navCtrl.setRoot(PManagerHomePage)
    }
  }
  menuClick() {
    this.basicData.checkPumpCount();
  }
}
