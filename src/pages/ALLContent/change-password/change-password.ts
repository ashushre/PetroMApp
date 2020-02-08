import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Platform, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginPage } from '../login/login';
import { resetPassword } from '../../../app/resetPassword';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';
import { POwnerHomePage } from '../../POwnerContent/p-owner-home/p-owner-home';
import { PManagerHomePage } from '../../PMAnagerContent/p-manager-home/p-manager-home';
import { DsmHomePage } from '../../DSMContent/dsm-home/dsm-home';
import { TransporterPage } from '../../TransportersContent/transporter/transporter';

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {
  public userInfo = new resetPassword;
  user: FormGroup;

  constructor(public navCtrl: NavController,
    public storage: Storage,
    public appCtrl: App,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public basicData: BasicDataProvider,
    public navParams: NavParams) {
    this.user = new FormGroup({
      opassword: new FormControl({ value: '' }, Validators.compose([Validators.required,])),
      npassword: new FormControl({ value: '' }, Validators.compose([Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$])(?=.{8,20})/)])),
      cpassword: new FormControl({ value: '' }, Validators.compose([Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$])(?=.{8,20})/)])),
    });
    this.platform.registerBackButtonAction(()=> {
      if (this.userInfo.changePassword == undefined || this.userInfo.changePassword == null) {
        switch (this.userInfo.userType) {
          case '11':
            this.navCtrl.setRoot(POwnerHomePage);
            break;
          case '12':
            this.navCtrl.setRoot(PManagerHomePage);
            break;
          case '13':
            this.navCtrl.setRoot(DsmHomePage);
            break;
          case '21':
            this.navCtrl.setRoot(TransporterPage);
            break;
          case '22':
            this.navCtrl.setRoot(TransporterPage);
            break;
        }
      }
      else {
        this.appCtrl.getRootNavs()[0].push(LoginPage);
      }
    });
  }

  ionViewDidLoad() {
    this.userInfo.changePassword = this.navParams.get('userInfo');
    this.storage.get('userType').then((val) => {
      this.userInfo.userType = val;
    },err=>{
      console.log(err);
    });
    if (this.userInfo.changePassword !== undefined) {
      this.userInfo.show = false;
    }
    this.storage.get('username').then((val) => {
      this.userInfo.username = val;
    },err=>{
      console.log(err);
    });
    this.storage.get('password').then((val) => {
      this.userInfo.password = val;
    },err=>{
      console.log(err);
    });


  }
  home() {
    console.log("s",this.userInfo.userType)
    if (this.userInfo.changePassword == undefined || this.userInfo.changePassword == null) {
      switch (this.userInfo.userType) {
        case '11':
          this.navCtrl.setRoot(POwnerHomePage);
          break;
        case '12':
          this.navCtrl.setRoot(PManagerHomePage);
          break;
        case '13':
          this.navCtrl.setRoot(DsmHomePage);
          break;
        case '21':
          this.navCtrl.setRoot(TransporterPage);
          break;
        case '22':
          this.navCtrl.setRoot(TransporterPage);
          break;
      }
    }
    else {
      this.appCtrl.getRootNavs()[0].push(LoginPage);
    }
  }
  submit() {
    let loading = this.loadingCtrl.create({
        content: 'Please wait...',
        enableBackdropDismiss: true,
    });
    loading.present();
    if (this.userInfo.changePassword == undefined || this.userInfo.changePassword == null) {
      if (this.user.valid) {
        if (this.userInfo.password = this.userInfo.opassword) {
          if (this.userInfo.cpassword == this.userInfo.npassword)
            if (this.userInfo.npassword == this.userInfo.opassword) {
              this.basicData.sendErrorNotification("New Password cannot be same as your current password. Please choose a different password.")
              loading.dismiss();
            }
            else {
              this.userInfo.username = this.userInfo.username;
              //  this.userInfo.userType = this.userType;
              this.userInfo.password = this.userInfo.npassword;
              console.log(this.userInfo);
              this.basicData.verifyOtp(this.userInfo).subscribe(res => {
                this.userInfo.success = JSON.stringify(res);
                this.userInfo.success = JSON.parse(this.userInfo.success).error;
                if (this.userInfo.success == undefined || this.userInfo.success == null) {
                  loading.dismiss();
                  this.basicData.sendSuccessNotification("Password Change Successfully");
                  this.navCtrl.setRoot(LoginPage);

                }
                else {
                  this.basicData.sendSuccessNotification("" + this.userInfo.success);
                  loading.dismiss();
                }
              }, err => {
                this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      loading.dismiss();
              }
              )
            }
          else {
            this.basicData.sendErrorNotification("Password doesn't Match");
            loading.dismiss();
          }
        }
        else {
          this.basicData.sendErrorNotification("Old password is not correct");
          loading.dismiss();
        }
      }
    }
    else {
      this.resetPassword();
      loading.dismiss();
    }
  }
  togglePasswordMode() {
    this.userInfo.password_type = this.userInfo.password_type === 'text' ? 'password' : 'text';
  }
  togglePasswordMode1() {
    this.userInfo.password_type1 = this.userInfo.password_type1 === 'text' ? 'password' : 'text';
  }
  togglePasswordMode2() {
    this.userInfo.password_type2 = this.userInfo.password_type2 === 'text' ? 'password' : 'text';
  }
  resetPassword() {
    let loading = this.loadingCtrl.create({
        content: 'Please wait...',         enableBackdropDismiss: true,
    });
    loading.present();
    if (this.userInfo.cpassword == this.userInfo.npassword) {
      this.userInfo.username = this.userInfo.changePassword.username;
      this.userInfo.mobileNo = this.userInfo.changePassword.mobileNo;
      this.userInfo.password = this.userInfo.npassword;
      console.log(this.userInfo);
      this.basicData.verifyOtp(this.userInfo).subscribe(res => {
        this.userInfo.success = JSON.stringify(res);
        this.userInfo.success = JSON.parse(this.userInfo.success).error;
        if (this.userInfo.success == undefined || this.userInfo.success == null) {
          loading.dismiss();
          this.basicData.sendSuccessNotification("Password Change Successfully");
          this.navCtrl.setRoot(LoginPage);

        }
        else {
          this.basicData.sendSuccessNotification("" + this.userInfo.success);
          loading.dismiss();
        }
      })
    }
    else {
      this.basicData.sendErrorNotification("Password doesn't Match")
      loading.dismiss();
    }
  }

}
