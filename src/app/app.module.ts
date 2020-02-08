
import { SalesDataProvider } from './../providers/sales-data/sales-data';
import { TransDataProvider } from './../providers/trans-data/trans-data';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule, Pipe } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { MyApp } from "./app.component";
import { BasicDataProvider } from '../providers/basic-data/basic-data';
import { PumpDataProvider } from '../providers/pump-data/pump-data';
import { CreditDataProvider } from '../providers/credit-data/credit-data';
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { ReportsProvider } from '../providers/reports/reports';
import { DatePipe } from '@angular/common';
import { Network } from '../../node_modules/@ionic-native/network';
import { SmsDataProvider } from '../providers/sms-data/sms-data';
import { Camera} from '@ionic-native/camera';
import { FileTransfer} from '@ionic-native/file-transfer';
import { ReactiveFormsModule } from '@angular/forms';
import { TransporterReportProvider } from '../providers/transporter-report/transporter-report';
import { DsmReportsProvider } from '../providers/dsm-reports/dsm-reports';
import { POwnerHomePage } from '../pages/POwnerContent/p-owner-home/p-owner-home';
import { PManagerHomePage } from '../pages/PMAnagerContent/p-manager-home/p-manager-home';
import { DsmHomePage } from '../pages/DSMContent/dsm-home/dsm-home';
import { LoginPage } from '../pages/ALLContent/login/login';
import { TransporterPage } from '../pages/TransportersContent/transporter/transporter'
import { AppVersion } from '@ionic-native/app-version';
//import { InAppBrowser } from '@ionic-native/in-app-browser';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { PipesModule } from '../pipes/pipes.module';
// import { InCurrencyPipe } from '../pipes/in-currency/in-currency';

// import { DateTimePipe } from '../pipes/date-time/date-time';
// import { INquantityPipe } from '../pipes/i-nquantity/i-nquantity';
@NgModule({
  declarations: [
    MyApp,
    POwnerHomePage,
    PManagerHomePage,
    DsmHomePage,
    LoginPage,
    TransporterPage,
 
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    PipesModule,
  //  DateTime,
   // NgxQRCodeModule,
    IonicModule.forRoot(MyApp, {
      scrollPadding: false,
      navExitApp: false,
      // scrollAssist: true,
      // autoFocusAssist: false
      ReactiveFormsModule,
      scrollAssist: false, autoFocusAssist: false 
    }),
    IonicStorageModule.forRoot({
      name: '__ionic3_start_theme',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    POwnerHomePage,
    PManagerHomePage,
    DsmHomePage,
    LoginPage,

    TransporterPage,

  ],
  providers: [
    Network,
    StatusBar,
    DatePipe,
    SplashScreen,
    Keyboard,
    BasicDataProvider,
   // InAppBrowser,
    //QRScanner,
    PumpDataProvider,
    TransDataProvider,
    SalesDataProvider,
    CreditDataProvider,
    BarcodeScanner,
    AppVersion,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ReportsProvider,
    SmsDataProvider,
    Camera,FileTransfer,

    TransporterReportProvider,
    DsmReportsProvider,
  ]
})

export class AppModule {

}
