import { LoginPage } from './../pages/ALLContent/login/login';
import { TransporterPage } from './../pages/TransportersContent/transporter/transporter';
import { PManagerHomePage } from './../pages/PMAnagerContent/p-manager-home/p-manager-home';
import { POwnerHomePage } from './../pages/POwnerContent/p-owner-home/p-owner-home';
import { DsmHomePage } from './../pages/DSMContent/dsm-home/dsm-home';
import { Component, ViewChild } from "@angular/core";
import { Platform, Nav, App, Events, NavController, AlertController } from "ionic-angular";
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';
import { BasicDataProvider } from '../providers/basic-data/basic-data';
import { AppVersion } from '@ionic-native/app-version';
//import { InAppBrowser } from '@ionic-native/in-app-browser';
export interface MenuItem {
  title: string;
  component: any;
  icon: string;
  badgeCount: any;
}

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;
  @ViewChild('myNav') navCtrl: NavController
  public userType: any;
  appMenuItems11: Array<MenuItem>;
  appMenuItems111: Array<MenuItem>;
  appMenuItems121: Array<MenuItem>;
  appMenuItems1211:Array<MenuItem>;
  appMenuItems12: Array<MenuItem>;
  appMenuItems13: Array<MenuItem>;
  appMenuItems21: Array<MenuItem>;
  appMenuItems22: Array<MenuItem>;
  public rootPage: any;
  public versionNumber: any;
  public previousversionNumber: any;
  public password: any;
  public transporterId: number;
  public username: string;
  public name: string;
  public empCount: number;
  public transCount: number;
  public sample: any;
  public imgLink: any;
  mgrStatus:number;
  driverCount: number;
  activeCS: number;
  userPhoto: any;
  same: boolean;
  apiUrl: any
  mgrCount: number;
  pumpCount: number;
  reqCount: number;
  vehicleCount: number;
  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public appCtrl: App,
    //private iab: InAppBrowser,
    public basicData: BasicDataProvider,
    public alertCtrl: AlertController,
    public events: Events,
    private appVersion: AppVersion,
    public network: Network,
    public splashScreen: SplashScreen,
    public keyboard: Keyboard,
    public storage: Storage,
    
  ) {
    this.initializeApp();
    this.apiUrl = this.basicData.photoURl;
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {      
      this.appCtrl.getRootNav().setRoot("NoInternetPage");
    }, err => {
      console.log(err);
    });

//*Check Inetrnet Connection
    this.network.onchange().subscribe(() => {
      switch (this.network.type) {
        case '2g':
          this.appCtrl.getRootNav().setRoot("NoInternetPage");
          break;
        case '3g':
          this.appCtrl.getRootNav().setRoot("NoInternetPage");
          break;

      }
    }, err => {
      console.log(err);
    });
    if (this.network.type == "2g" || this.network.type == "3g") {
      this.appCtrl.getRootNav().setRoot("NoInternetPage");
    }

    // var sample= this.network.type;
    // console.log("Type:"+sample);
  }

  public initializeApp() {


    this.events.subscribe('user:created', (user) => {
      console.log("img:" + this.userPhoto);
      this.userType = user.userType;
      this.empCount = user.allCount.empCount;
      this.mgrStatus=user.mgrStatus;
      this.transCount = user.allCount.transCount;
      this.driverCount = user.allCount.driverCount;
      this.userPhoto = user.photo;
      this.reqCount = user.allCount.reqCount;
      this.mgrCount = user.allCount.mgrCount;
      this.vehicleCount = user.allCount.vehicleCount;
      this.pumpCount = user.allCount.pumpCount;
      this.name = user.name;
      this.activeCS = user.activeCS;

      if (this.userPhoto == null) {
        this.userPhoto = 0;
      }
      this.imgLink = this.apiUrl + "/storage/users/" + this.userPhoto;
      this.appMenuItems11 = [
        { title: 'Home', component: POwnerHomePage, icon: 'home', badgeCount: '' },
        { title: 'Employees', component: "PumpEmployeePage", icon: 'ios-people', badgeCount: this.empCount },
        { title: 'Customers', component: "PumpTransportersListPage", icon: 'md-car', badgeCount: this.transCount },
        { title: 'Product Rates', component: "ProductRatePage", icon: 'md-pricetags', badgeCount: '' },
     //   { title: 'Payment Reminder', component: "PaymentRequestPage", icon: 'ios-notifications', badgeCount: '' },
        // { title: 'Payment Confirmation', component: "PaymentConfirmationPage", icon: 'ios-notifications', badgeCount: '' },
       // { title: 'SMS Reports', component: "SmsReportPage", icon: 'ios-mail', badgeCount: '' },
        { title: 'Reports', component: "PumpReportPage", icon: 'md-paper', badgeCount: '' },
        { title: 'Change Password', component: "ChangePasswordPage", icon: 'key', badgeCount: '' },
        { title: 'Contact Us', component: "ContactUsPage", icon: 'md-call', badgeCount: '' }
      ];
      this.appMenuItems111 = [
        { title: 'Home', component: POwnerHomePage, icon: 'home', badgeCount: '' },
        { title: 'Employees', component: "PumpEmployeePage", icon: 'ios-people', badgeCount: this.empCount },
        // { title: 'Transporters', component: "PumpTransportersListPage", icon: 'md-car', badgeCount: this.transCount },
        { title: 'Product Rates', component: "ProductRatePage", icon: 'md-pricetags', badgeCount: '' },
       // { title: 'Payment Reminder', component: "PaymentRequestPage", icon: 'ios-notifications', badgeCount: '' },
       // { title: 'SMS Reports', component: "SmsReportPage", icon: 'ios-mail', badgeCount: '' },
        { title: 'Reports', component: "PumpReportPage", icon: 'md-paper', badgeCount: '' },
        { title: 'Change Password', component: "ChangePasswordPage", icon: 'key', badgeCount: '' },
        { title: 'Contact Us', component: "ContactUsPage", icon: 'md-call', badgeCount: '' }
      ];
      this.appMenuItems121 = [
        { title: 'Home', component: PManagerHomePage, icon: 'home', badgeCount: '' },
        { title: 'Employees', component: "PumpEmployeePage", icon: 'ios-people', badgeCount: this.empCount },
        // { title: 'Cash Dispense', component: "CashDispensePage", icon: 'md-cash', badgeCount: '' },
        { title: 'Product Rates', component: "ProductRatePage", icon: 'md-pricetags', badgeCount: '' },
        { title: 'Nozzle Testing', component: "NozzleTestingPage", icon: 'color-fill', badgeCount: '' },
        //   { title: 'Payment Reminder', component: "PaymentRequestPage", icon: 'ios-notifications', badgeCount: '' },
        //   { title: 'Payment Confirmation', component: "PaymentConfirmationPage", icon: 'ios-notifications', badgeCount: '' },
        { title: 'Tank Dips', component: "TankDipsPage", icon: 'ios-thermometer-outline', badgeCount: '' },
        { title: 'Reports', component: "PumpReportPage", icon: 'md-paper', badgeCount: '' },
        { title: 'Change Password', component: "ChangePasswordPage", icon: 'key', badgeCount: '' },
        { title: 'Contact Us', component: "ContactUsPage", icon: 'md-call', badgeCount: '' },
        { title: 'Help', component: "ManagerManualPage", icon: 'information-circle', badgeCount: '' }
      ];
      this.appMenuItems1211 = [
        { title: 'Home', component: PManagerHomePage, icon: 'home', badgeCount: '' },
        { title: 'Reports', component: "PumpReportPage", icon: 'md-paper', badgeCount: '' },
        { title: 'Change Password', component: "ChangePasswordPage", icon: 'key', badgeCount: '' },
        { title: 'Contact Us', component: "ContactUsPage", icon: 'md-call', badgeCount: '' },
        { title: 'Help', component: "ManagerManualPage", icon: 'information-circle', badgeCount: '' }
      ];
      
      this.appMenuItems12 = [
        { title: 'Home', component: PManagerHomePage, icon: 'home', badgeCount: '' },
        { title: 'Employees', component: "PumpEmployeePage", icon: 'ios-people', badgeCount: this.empCount },
        // { title: 'Cash Dispense', component: "CashDispensePage", icon: 'md-cash', badgeCount: '' },
        { title: 'Product Rates', component: "ProductRatePage", icon: 'md-pricetags', badgeCount: '' },
      //  { title: 'Payment Reminder', component: "PaymentRequestPage", icon: 'ios-notifications', badgeCount: '' },
        { title: 'Nozzle Testing', component: "NozzleTestingPage", icon: 'color-fill', badgeCount: '' },
        // { title: 'Payment Confirmation', component: "PaymentConfirmationPage", icon: 'ios-notifications', badgeCount: '' },
        { title: 'Tank Dips', component: "TankDipsPage", icon: 'ios-thermometer-outline', badgeCount: '' },
        { title: 'Reports', component: "PumpReportPage", icon: 'md-paper', badgeCount: '' },
        { title: 'Change Password', component: "ChangePasswordPage", icon: 'key', badgeCount: '' },
        { title: 'Contact Us', component: "ContactUsPage", icon: 'md-call', badgeCount: '' },
        { title: 'Help', component: "ManagerManualPage", icon: 'information-circle', badgeCount: '' }
      ];

      this.appMenuItems13 = [
        { title: 'Home', component: DsmHomePage, icon: 'home', badgeCount: '' },
        { title: 'SaleMan Reports', component: "DsmReportsPage", icon: 'md-paper', badgeCount: '' },
        { title: 'Change Password', component: "ChangePasswordPage", icon: 'key', badgeCount: '' },
        { title: 'Contact Us', component: "ContactUsPage", icon: 'md-call', badgeCount: '' },
        { title: 'Help', component: "DsmManualPage", icon: 'information-circle', badgeCount: '' }
      ];

      this.appMenuItems21 = [
        { title: 'Home', component: TransporterPage, icon: 'home', badgeCount: '' },
        { title: 'My Requests', component: "RequestListPage", icon: 'md-git-pull-request', badgeCount: this.reqCount },
        { title: 'My Managers', component: "ManagerListPage", icon: 'ios-people', badgeCount: this.mgrCount },
        { title: 'My Vehicles', component: "VehicleListPage", icon: 'md-car', badgeCount: this.vehicleCount },
        // { title: 'My Drivers', component: "TDriverListPage", icon: 'ios-people', badgeCount: this.driverCount },
        { title: 'Payment Entry', component: "PaymentEntryPage", icon: 'md-cash', badgeCount: '' },
        { title: 'My Reports', component: "TransporterReportPage", icon: 'md-paper', badgeCount: '' },
        { title: 'My Pumps', component: "PumpListPage", icon: 'md-barcode', badgeCount: this.pumpCount },
        { title: 'Change Password', component: "ChangePasswordPage", icon: 'key', badgeCount: '' },
        { title: 'Contact Us', component: "ContactUsPage", icon: 'md-call', badgeCount: '' }
      ];

      this.appMenuItems22 = [
        { title: 'Home', component: TransporterPage, icon: 'home', badgeCount: '' },
        { title: 'My Requests', component: "RequestListPage", icon: 'md-git-pull-request', badgeCount: this.reqCount },
        { title: 'My Vehicles', component: "VehicleListPage", icon: 'md-car', badgeCount: this.vehicleCount },
        // { title: 'My Drivers', component: "TDriverListPage", icon: 'ios-people', badgeCount: this.driverCount },
        { title: 'Payment Entry', component: "PaymentEntryPage", icon: 'md-cash', badgeCount: '' },
        { title: 'My Reports', component: "TransporterReportPage", icon: 'md-paper', badgeCount: '' },
        { title: 'My Pumps', component: "PumpListPage", icon: 'md-barcode', badgeCount: this.pumpCount },
        { title: 'Change Password', component: "ChangePasswordPage", icon: 'key', badgeCount: '' },
        { title: 'Contact Us', component: "ContactUsPage", icon: 'md-call', badgeCount: '' }
      ];
    }, err => {
      console.log(err);
    });


    this.events.subscribe('user:updated', (user) => {
      user = user;
      this.empCount = user.empCount;
      this.mgrStatus=user.mgrStatus;
      this.transCount = user.transCount;
      console.log(this.mgrStatus)

      this.appMenuItems11 = [
        { title: 'Home', component: POwnerHomePage, icon: 'home', badgeCount: '' },
        { title: 'Employees', component: "PumpEmployeePage", icon: 'ios-people', badgeCount: this.empCount },
        { title: 'Customers', component: "PumpTransportersListPage", icon: 'md-car', badgeCount: this.transCount },
        { title: 'Product Rates', component: "ProductRatePage", icon: 'md-pricetags', badgeCount: '' },
       // { title: 'Payment Reminder', component: "PaymentRequestPage", icon: 'ios-notifications', badgeCount: '' },
        { title: 'Nozzle Testing', component: "NozzleTestingPage", icon: 'color-fill', badgeCount: '' },
        // { title: 'Payment Confirmation', component: "PaymentConfirmationPage", icon: 'md-cash', badgeCount: '' },
       // { title: 'SMS Reports', component: "SmsReportPage", icon: 'ios-mail', badgeCount: '' },
        { title: 'Reports', component: "PumpReportPage", icon: 'md-paper', badgeCount: '' },
        { title: 'Change Password', component: "ChangePasswordPage", icon: 'key', badgeCount: '' },
        { title: 'Contact Us', component: "ContactUsPage", icon: 'md-call', badgeCount: '' }
      ];
      this.appMenuItems111 = [
        { title: 'Home', component: POwnerHomePage, icon: 'home', badgeCount: '' },
        { title: 'Employees', component: "PumpEmployeePage", icon: 'ios-people', badgeCount: this.empCount },
        // { title: 'Transporters', component: "PumpTransportersListPage", icon: 'md-car', badgeCount: this.transCount },
        { title: 'Product Rates', component: "ProductRatePage", icon: 'md-pricetags', badgeCount: '' },
      //  { title: 'Payment Reminder', component: "PaymentRequestPage", icon: 'ios-notifications', badgeCount: '' },
      //  { title: 'SMS Reports', component: "SmsReportPage", icon: 'ios-mail', badgeCount: '' },
        { title: 'Reports', component: "PumpReportPage", icon: 'md-paper', badgeCount: '' },
        { title: 'Change Password', component: "ChangePasswordPage", icon: 'key', badgeCount: '' },
        { title: 'Contact Us', component: "ContactUsPage", icon: 'md-call', badgeCount: '' }
      ];
      this.appMenuItems12 = [
        { title: 'Home', component: PManagerHomePage, icon: 'home', badgeCount: '' },
        { title: 'Employees', component: "PumpEmployeePage", icon: 'ios-people', badgeCount: this.empCount },
        // { title: 'Cash Dispense', component: "CashDispensePage", icon: 'md-cash', badgeCount: '' },
        { title: 'Product Rates', component: "ProductRatePage", icon: 'md-pricetags', badgeCount: '' },
     //   { title: 'Payment Reminder', component: "PaymentRequestPage", icon: 'ios-notifications', badgeCount: '' },
        { title: 'Nozzle Testing', component: "NozzleTestingPage", icon: 'color-fill', badgeCount: '' },
        // { title: 'Payment Confirmation', component: "PaymentConfirmationPage", icon: 'md-cash', badgeCount: '' },
        { title: 'Tank Dips', component: "TankDipsPage", icon: 'ios-thermometer-outline', badgeCount: '' },
        { title: 'Reports', component: "PumpReportPage", icon: 'md-paper', badgeCount: '' },
        { title: 'Change Password', component: "ChangePasswordPage", icon: 'key', badgeCount: '' },
        { title: 'Contact Us', component: "ContactUsPage", icon: 'md-call', badgeCount: '' },
        { title: 'Help', component: "ManagerManualPage", icon: 'information-circle', badgeCount: '' }
      ];
      this.appMenuItems121 = [
        { title: 'Home', component: PManagerHomePage, icon: 'home', badgeCount: '' },
        { title: 'Employees', component: "PumpEmployeePage", icon: 'ios-people', badgeCount: this.empCount },
        // { title: 'Cash Dispense', component: "CashDispensePage", icon: 'md-cash', badgeCount: '' },
        { title: 'Product Rates', component: "ProductRatePage", icon: 'md-pricetags', badgeCount: '' },
        { title: 'Nozzle Testing', component: "NozzleTestingPage", icon: 'color-fill', badgeCount: '' },
        //  { title: 'Payment Reminder', component: "PaymentRequestPage", icon: 'ios-notifications', badgeCount: '' },
        //  { title: 'Payment Confirmation', component: "PaymentConfirmationPage", icon: 'ios-notifications', badgeCount: '' },
        { title: 'Tank Dips', component: "TankDipsPage", icon: 'ios-thermometer-outline', badgeCount: '' },
        { title: 'Reports', component: "PumpReportPage", icon: 'md-paper', badgeCount: '' },
        { title: 'Change Password', component: "ChangePasswordPage", icon: 'key', badgeCount: '' },
        { title: 'Contact Us', component: "ContactUsPage", icon: 'md-call', badgeCount: '' },
        { title: 'Help', component: "ManagerManualPage", icon: 'information-circle', badgeCount: '' }
      ];
      this.appMenuItems1211 = [
        { title: 'Home', component: PManagerHomePage, icon: 'home', badgeCount: '' },
        { title: 'Reports', component: "PumpReportPage", icon: 'md-paper', badgeCount: '' },
        { title: 'Change Password', component: "ChangePasswordPage", icon: 'key', badgeCount: '' },
        { title: 'Contact Us', component: "ContactUsPage", icon: 'md-call', badgeCount: '' },
        { title: 'Help', component: "ManagerManualPage", icon: 'information-circle', badgeCount: '' }
      ];
    }, err => {
      console.log(err);
    });


    this.events.subscribe('user:updated1', (user) => {
      this.driverCount = user.driverCount;
      this.mgrCount = user.mgrCount;
      this.vehicleCount = user.vehicleCount;
      this.pumpCount = user.pumpCount;
      this.reqCount = user.reqCount;

      this.appMenuItems21 = [
        { title: 'Home', component: TransporterPage, icon: 'home', badgeCount: '' },
        { title: 'My Requests', component: "RequestListPage", icon: 'md-git-pull-request', badgeCount: this.reqCount },
        { title: 'My Managers', component: "ManagerListPage", icon: 'ios-people', badgeCount: this.mgrCount },
        { title: 'My Vehicles', component: "VehicleListPage", icon: 'md-car', badgeCount: this.vehicleCount },
        // { title: 'My Drivers', component: "TDriverListPage", icon: 'ios-people', badgeCount: this.driverCount },
        { title: 'Payment Entry', component: "PaymentEntryPage", icon: 'md-cash', badgeCount: '' },
        { title: 'My Reports', component: "TransporterReportPage", icon: 'md-paper', badgeCount: '' },
        { title: 'My Pumps', component: "PumpListPage", icon: 'md-barcode', badgeCount: this.pumpCount },
        { title: 'Change Password', component: "ChangePasswordPage", icon: 'key', badgeCount: '' },
        { title: 'Contact Us', component: "ContactUsPage", icon: 'md-call', badgeCount: '' }
      ];

      this.appMenuItems22 = [
        { title: 'Home', component: TransporterPage, icon: 'home', badgeCount: '' },
        { title: 'My Requests', component: "RequestListPage", icon: 'md-git-pull-request', badgeCount: this.reqCount },
        { title: 'My Vehicles', component: "VehicleListPage", icon: 'md-car', badgeCount: this.vehicleCount },
        // { title: 'My Drivers', component: "TDriverListPage", icon: 'ios-people', badgeCount: this.driverCount },
        { title: 'Payment Entry', component: "PaymentEntryPage", icon: 'md-cash', badgeCount: '' },
        { title: 'My Reports', component: "TransporterReportPage", icon: 'md-paper', badgeCount: '' },
        { title: 'My Pumps', component: "PumpListPage", icon: 'md-barcode', badgeCount: this.pumpCount },
        { title: 'Change Password', component: "ChangePasswordPage", icon: 'key', badgeCount: '' },
        { title: 'Contact Us', component: "ContactUsPage", icon: 'md-call', badgeCount: '' }
      ];
    }, err => {
      console.log(err);
    });


    this.platform.ready().then(() => {
    //  this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(false);
     // this.keyboard.disableScroll(true);
       if (this.platform.is('android')) {
        this.appVersion.getVersionNumber().then(version => {
          this.versionNumber = version;
          //this.basicData.sendErrorNotification(this.versionNumber);

        });
        
        this.basicData.versionCheck().subscribe(res => {
          console.log("Version", res.versionName);
          this.previousversionNumber=res.versionName;
          if(this.versionNumber==this.previousversionNumber)
          {
          }
            else{
              this.rootPage="TdriverAddPage"
              
  // let alert = this.alertCtrl.create({
  //   message: "Please Update the PetroMapp",
  //     enableBackdropDismiss: false,
  //   buttons: [
  //     {
  //       text: "Ok",
  //       handler: () => {
  //         window.open("https://play.google.com/store/apps/details?id=io.stytechhub.petroerp&hl=en_IN","_system");
  //         }
  //       }
  //   ]
  // });
  // alert.present();
           }
              }, error => {
         this.basicData.sendErrorNotification(error);
       })
  } 
 
  

            this.storage.get('username').then((val) => {
              this.username = val;
            }, err => {
              console.log(err);
            });
            this.storage.get('name').then((val) => {
              this.name = val;
            }, err => {
              console.log(err);
            });
            this.storage.get('empCount').then((val) => {
              this.empCount = val;
            }, err => {
              console.log(err);
            });
            this.storage.get('mgrStatus').then((val) => {
              this.mgrStatus = val;
            }, err => {
              console.log(err);
            });
            this.storage.get('transCount').then((val) => {
              this.transCount = val;
            }, err => {
              console.log(err);
            });
            this.storage.get('driverCount').then((val) => {
              this.driverCount = val;
            }, err => {
              console.log(err);
            });
            this.storage.get('mgrCount').then((val) => {
              this.mgrCount = val;
            }, err => {
              console.log(err);
            });
            
            this.storage.get('pumpCount').then((val) => {
              this.pumpCount = val;
            }, err => {
              console.log(err);
            });
            this.storage.get('reqCount').then((val) => {
              this.reqCount = val;
            }, err => {
              console.log(err);
            });
            this.storage.get('vehicleCount').then((val) => {
              this.vehicleCount = val;
            }, err => {
              console.log(err);
            });
            this.storage.get('photo').then((val) => {
              this.userPhoto = val;
      
              if (this.userPhoto == null) {
                this.userPhoto = 0;
              }
              this.imgLink = this.apiUrl + "/storage/users/" + this.userPhoto;
              console.log(this.userPhoto, this.imgLink);
            }, err => {
              console.log(err);
            });
            this.storage.get('activeCS').then((val) => {
              this.activeCS = val;
            }, err => {
              console.log(err);
            });
            this.storage.get('userType').then((val) => {
              this.userType = val;
              if (this.userType == undefined || this.userType == null) {
                this.rootPage = LoginPage;
              }
              else {
                switch (this.userType) {
      
                  case '11':
                    this.rootPage = POwnerHomePage;
                    break;
                  case '12':
                    this.rootPage = PManagerHomePage
                    break;
                  case '13':
                    this.rootPage = DsmHomePage;
                    break;
                  case '21':
                    this.rootPage = TransporterPage
                    break;
                  case '22':
                    this.rootPage = TransporterPage;
                    break;
                }
                this.appMenuItems11 = [
                  { title: 'Home', component: POwnerHomePage, icon: 'home', badgeCount: '' },
                  { title: 'Employees', component: "PumpEmployeePage", icon: 'ios-people', badgeCount: this.empCount },
                  { title: 'Customers', component: "PumpTransportersListPage", icon: 'md-car', badgeCount: this.transCount },
                  { title: 'Product Rates', component: "ProductRatePage", icon: 'md-pricetags', badgeCount: '' },
                //  { title: 'Payment Reminder', component: "PaymentRequestPage", icon: 'ios-notifications', badgeCount: '' },
                  // { title: 'Payment Confirmation', component: "PaymentConfirmationPage", icon: 'md-cash', badgeCount: '' },
                //  { title: 'SMS Reports', component: "SmsReportPage", icon: 'ios-mail', badgeCount: '' },
                  { title: 'Reports', component: "PumpReportPage", icon: 'md-paper', badgeCount: '' },
                  { title: 'Change Password', component: "ChangePasswordPage", icon: 'key', badgeCount: '' },
                  { title: 'Contact Us', component: "ContactUsPage", icon: 'md-call', badgeCount: '' }
                ];
                this.appMenuItems111 = [
                  { title: 'Home', component: POwnerHomePage, icon: 'home', badgeCount: '' },
                  { title: 'Employees', component: "PumpEmployeePage", icon: 'ios-people', badgeCount: this.empCount },
                  // { title: 'Transporters', component: "PumpTransportersListPage", icon: 'md-car', badgeCount: this.transCount },
                  { title: 'Product Rates', component: "ProductRatePage", icon: 'md-pricetags', badgeCount: '' },
                 // { title: 'Payment Reminder', component: "PaymentRequestPage", icon: 'ios-notifications', badgeCount: '' },
                //  { title: 'SMS Reports', component: "SmsReportPage", icon: 'ios-mail', badgeCount: '' },
                  { title: 'Reports', component: "PumpReportPage", icon: 'md-paper', badgeCount: '' },
                  { title: 'Change Password', component: "ChangePasswordPage", icon: 'key', badgeCount: '' },
                  { title: 'Contact Us', component: "ContactUsPage", icon: 'md-call', badgeCount: '' }
                ];
                this.appMenuItems12 = [
                  { title: 'Home', component: PManagerHomePage, icon: 'home', badgeCount: '' },
                  { title: 'Employees', component: "PumpEmployeePage", icon: 'ios-people', badgeCount: this.empCount },
                  //  { title: 'Cash Dispense', component: "CashDispensePage", icon: 'md-cash', badgeCount: '' },
                  { title: 'Product Rates', component: "ProductRatePage", icon: 'md-pricetags', badgeCount: '' },
                //  { title: 'Payment Reminder', component: "PaymentRequestPage", icon: 'ios-notifications', badgeCount: '' },
                  { title: 'Nozzle Testing', component: "NozzleTestingPage", icon: 'color-fill', badgeCount: '' },
                  // { title: 'Payment Confirmation', component: "PaymentConfirmationPage", icon: 'md-cash', badgeCount: '' },
                  { title: 'Tank Dips', component: "TankDipsPage", icon: 'ios-thermometer-outline', badgeCount: '' },
                  { title: 'Reports', component: "PumpReportPage", icon: 'md-paper', badgeCount: '' },
                  { title: 'Change Password', component: "ChangePasswordPage", icon: 'key', badgeCount: '' },
                  { title: 'Contact Us', component: "ContactUsPage", icon: 'md-call', badgeCount: '' },
                  { title: 'Help', component: "ManagerManualPage", icon: 'information-circle', badgeCount: '' }
                ];
                this.appMenuItems121 = [
                  { title: 'Home', component: PManagerHomePage, icon: 'home', badgeCount: '' },
                  { title: 'Employees', component: "PumpEmployeePage", icon: 'ios-people', badgeCount: this.empCount },
                  // { title: 'Cash Dispense', component: "CashDispensePage", icon: 'md-cash', badgeCount: '' },
                  { title: 'Product Rates', component: "ProductRatePage", icon: 'md-pricetags', badgeCount: '' },
                  // { title: 'Payment Reminder', component: "PaymentRequestPage", icon: 'ios-notifications', badgeCount: '' },
                  // { title: 'Payment Confirmation', component: "PaymentConfirmationPage", icon: 'ios-notifications', badgeCount: '' },
                  { title: 'Tank Dips', component: "TankDipsPage", icon: 'ios-thermometer-outline', badgeCount: '' },
                  { title: 'Reports', component: "PumpReportPage", icon: 'md-paper', badgeCount: '' },
                  { title: 'Change Password', component: "ChangePasswordPage", icon: 'key', badgeCount: '' },
                  { title: 'Contact Us', component: "ContactUsPage", icon: 'md-call', badgeCount: '' },
                  { title: 'Help', component: "ManagerManualPage", icon: 'information-circle', badgeCount: '' }
                ];

                this.appMenuItems1211 = [
                  { title: 'Home', component: PManagerHomePage, icon: 'home', badgeCount: '' },
                  { title: 'Reports', component: "PumpReportPage", icon: 'md-paper', badgeCount: '' },
                  { title: 'Change Password', component: "ChangePasswordPage", icon: 'key', badgeCount: '' },
                  { title: 'Contact Us', component: "ContactUsPage", icon: 'md-call', badgeCount: '' },
                  { title: 'Help', component: "ManagerManualPage", icon: 'information-circle', badgeCount: '' }
                ];
      
                this.appMenuItems13 = [
                  { title: 'Home', component: DsmHomePage, icon: 'home', badgeCount: '' },
                  { title: 'SaleMan Reports', component: "DsmReportsPage", icon: 'md-paper', badgeCount: '' },
                  { title: 'Change Password', component: "ChangePasswordPage", icon: 'key', badgeCount: '' },
                  { title: 'Contact Us', component: "ContactUsPage", icon: 'md-call', badgeCount: '' },
                  { title: 'Help', component: "DsmManualPage", icon: 'information-circle', badgeCount: '' }
                ];
      
                this.appMenuItems21 = [
                  { title: 'Home', component: TransporterPage, icon: 'home', badgeCount: '' },
                  { title: 'My Requests', component: "RequestListPage", icon: 'md-git-pull-request', badgeCount: this.reqCount },
                  { title: 'My Managers', component: "ManagerListPage", icon: 'ios-people', badgeCount: this.mgrCount },
                  { title: 'My Vehicles', component: "VehicleListPage", icon: 'md-car', badgeCount: this.vehicleCount },
                  // { title: 'My Drivers', component: "TDriverListPage", icon: 'ios-people', badgeCount: this.driverCount },
                  { title: 'Payment Entry', component: "PaymentEntryPage", icon: 'md-cash', badgeCount: '' },
                  { title: 'My Reports', component: "TransporterReportPage", icon: 'md-paper', badgeCount: '' },
                  { title: 'My Pumps', component: "PumpListPage", icon: 'md-barcode', badgeCount: this.pumpCount },
                  { title: 'Change Password', component: "ChangePasswordPage", icon: 'key', badgeCount: '' },
                  { title: 'Contact Us', component: "ContactUsPage", icon: 'md-call', badgeCount: '' }
                ];
      
                this.appMenuItems22 = [
                  { title: 'Home', component: TransporterPage, icon: 'home', badgeCount: '' },
                  { title: 'My Requests', component: "RequestListPage", icon: 'md-git-pull-request', badgeCount: this.reqCount },
                  { title: 'My Vehicles', component: "VehicleListPage", icon: 'md-car', badgeCount: this.vehicleCount },
                  // { title: 'My Drivers', component: "TDriverListPage", icon: 'ios-people', badgeCount: this.driverCount },
                  { title: 'Payment Entry', component: "PaymentEntryPage", icon: 'md-cash', badgeCount: '' },
                  { title: 'My Reports', component: "TransporterReportPage", icon: 'md-paper', badgeCount: '' },
                  { title: 'My Pumps', component: "PumpListPage", icon: 'md-barcode', badgeCount: this.pumpCount },
                  { title: 'Change Password', component: "ChangePasswordPage", icon: 'key', badgeCount: '' },
                  { title: 'Contact Us', component: "ContactUsPage", icon: 'md-call', badgeCount: '' }
                ];
              }
            }, err => {
              console.log(err);
            });
      


//}
  }, 
  err => {
      console.log(err);
    });
  }

  openPage(page) {
    this.appCtrl.getRootNav().setRoot(page.component);
  }

  editProfile() {
    switch (this.userType) {
      case '11':
        this.appCtrl.getRootNav().setRoot("POwnerProfilePage");
        break;
      case '12':
        this.appCtrl.getRootNav().setRoot("PumpProfilePage");
        break;
      case '13':
        this.appCtrl.getRootNav().setRoot("DsmProfilePage");
        break;
      case '21':
        this.appCtrl.getRootNav().setRoot("TransporterProfilePage");
        break;
      case '22':
        this.appCtrl.getRootNav().setRoot("TManagerProfilePage");
        break;
    }
  }

  logout() {

    this.appCtrl.getRootNav().setRoot(LoginPage);
    this.storage.clear();

  }

}
