
import { Country } from './../../app/country';
import { Region } from '../../app/region';
import { City } from '../../app/city';
import { User } from '../../app/user';
import { resetPassword } from '../../app/resetPassword';
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import { ToastController, LoadingController, Events } from 'ionic-angular';
import { Reports } from '../../app/reports';
import { Storage } from "@ionic/storage";



/*
  Generated class for the BasicDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BasicDataProvider {
  empCount: number;
  eCount: any;
  mgrStatus:number;
  transCount: number;
  pumpCount: number;
  mgrCount: number;
  vehicleCount: number;
  pumpId: number;
  reqCount: number;
  count = new Reports;
  transporterId: number;
  driverCount: number;
  employeeId:number;
  pumpList: any;
  transList: any;
  public flag=0;

  //*Production server
 // https://cors-anywhere.herokuapp.com/
 //  public apiUrl = "http://45.64.105.226/api";
 //  public photoURl = "http://45.64.105.226";

 public apiUrl = "https://petroerp.in/api";
 public photoURl = "https://petroerp.in";

  // // //*Testing server
  // public apiUrl = "http://5.180.244.88/api";
  // public photoURl = "http://5.180.244.88";

   // //*Testing server
  //  public apiUrl = "https://test.petroerp.in/api";
  //  public photoURl = "https://test.petroerp.in";

  // //*local server
   // public apiUrl = "http://petroerp.ind/api";
    //public photoURl = "http://petroerp.ind";ioni

    
  //*Demo server
  // public apiUrl="http://103.221.232.3/api";
  // public photoURl="http://103.221.232.3";

  //AWS Server
  // public apiUrl="http://13.234.96.106/api";
  // public photoURl="http://13.234.96.106";

  // public apiUrl="http://13.232.168.94/api";
  // public photoURl="http://13.232.168.94";


  token:any;
  reqHeader:any;
  constructor(public http: HttpClient,
    public toast: ToastController,
    public storage: Storage,
   // public basicData:BasicDataProvider,
    public events: Events,
    public loadingCtrl: LoadingController) {
      this.storage.get('token').then((val) => {
        this.token = val;
        this.reqHeader = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.token
        });

        
      },err=>{
        console.log(err);
      });
  }



  errorHandler(error: HttpErrorResponse) {
    console.log("Error"+error.message)
    return Observable.throw(error.message || "Server Error");
  }

  loginCheck(user: User): Observable<User> {
    //const headers = new HttpHeaders().set('content-type', 'application/json');

    return this.http.post<any>(this.apiUrl + "/login", user, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  versionCheck(): Observable<User> {
    return this.http.get<User>(this.apiUrl + "/users/getMobileVersion", { headers: this.reqHeader })
      .catch(this.errorHandler);
  }

  versionCheckIOS(): Observable<User> {
    return this.http.get<User>(this.apiUrl + "/users/getIOSMobileVersion")
    .catch(this.errorHandler);
  }
  
  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(this.apiUrl + "/countries", { headers: this.reqHeader })
      .catch(this.errorHandler);
  }

  getRegions(countryId): Observable<Region[]> {
    return this.http.get<Region[]>(this.apiUrl + "/regions/list/" + countryId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getPumpCt(pumpId): Observable<Reports> {
    return this.http.get<Reports>(this.apiUrl + "/pumps/getPumpCt/" + pumpId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getCities(regionId): Observable<City[]> {
    return this.http.get<City[]>(this.apiUrl + "/cities/list/" + regionId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  sendOtp(data: resetPassword): Observable<resetPassword> {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http.post<resetPassword>(this.apiUrl + "/users/getOTP", data, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  verifyOtp(data: resetPassword): Observable<resetPassword> {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http.post<resetPassword>(this.apiUrl + "/users/changePassword", data, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getTransporterCt(transporterId): Observable<Reports> {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http.get<Reports>(this.apiUrl + "/transporters/getTransporterCt/" + transporterId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }

  sendSuccessNotification(message: string): void {
    let notification = this.toast.create({
      message: message,
      duration: 3000,
      cssClass: "toast-success",
      // cssClass: "toast-error",
    });
    notification.present();
  }
  sendErrorNotification(message: string): void {
    let notification = this.toast.create({
      message: message,
      duration: 5000,
      cssClass: "toast-error",
    });
    notification.present();
  }
  Loader() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      enableBackdropDismiss: true,
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 1000);
  }
  checkPumpCount() {
    this.storage.get('empCount').then(val => {
      this.empCount = val;
    });
    this.storage.get('transCount').then(val => {
      this.transCount = val;
    });
    this.storage.get('mgrStatus').then(val => {
      this.mgrStatus = val;
    });
    this.storage.get('employeeId').then(val => {
      this.employeeId = val;
    });
    this.storage.get('pumpId').then(val => {
      this.pumpId = val;


      this.getPumpCt(this.pumpId).subscribe(res => {
       console.log(res,this.employeeId)
        this.pumpList = res;
        var managerId=this.pumpList.managerStaus.employeeId;
        var eCount = this.pumpList.empCount;
        var tCount = this.pumpList.transCount;
        console.log(eCount, tCount, this.empCount, this.transCount,managerId,this.employeeId)
        if (eCount == this.empCount && tCount == this.transCount && managerId!==this.employeeId) {
          console.log("equal")
        }
        else {
          this.storage.set('empCount', eCount);
          this.storage.set('transCount', tCount);

          this.count.empCount = eCount;
          this.count.transCount = tCount;
          if(managerId==this.employeeId)
          {
            this.count.mgrStatus = 1;
            this.storage.set('mgrStatus', 1);
           //   this.basicData.sendErrorNotification("notequal");
          }
          else
          {
            this.count.mgrStatus = 0;
            this.storage.set('mgrStatus', 0);
           // this.basicData.sendErrorNotification("mgrStatus");
          }

         
          this.events.publish('user:updated', this.count);
        }

      })
    });

  }
  checkTransCount() {
    this.storage.get('driverCount').then(val => {
      this.driverCount = val;
    });
    this.storage.get('vehicleCount').then(val => {
      this.vehicleCount = val;
    });
    this.storage.get('pumpCount').then(val => {
      this.pumpCount = val;
    });
    this.storage.get('mgrCount').then(val => {
      this.mgrCount = val;
    });
    this.storage.get('reqCount').then(val => {
      this.reqCount = val;
    });
    this.storage.get('transporterId').then(val => {
      this.transporterId = val;


      this.getTransporterCt(this.transporterId).subscribe(res => {
        this.pumpList = res;
        var dCount = this.pumpList.driverCount;
        var mCount = this.pumpList.mgrCount;
        var vCount = this.pumpList.vehicleCount;
        var pCount = this.pumpList.pumpCount;
        var rCount = this.pumpList.reqCount;
        // console.log(this.driverCount,this.vehicleCount,this.mgrCount,this.pumpCount);
        //console.log(dCount,vCount,mCount,pCount);
        if (dCount == this.driverCount && mCount == this.mgrCount && vCount == this.vehicleCount && pCount == this.pumpCount && rCount == this.reqCount) {
        }
        else {
          this.storage.set('driverCount', dCount);
          this.storage.set('mgrCount', mCount);
          this.storage.set('vehicleCount', vCount);
          this.storage.set('pumpCount', pCount);
          this.storage.set('reqCount', rCount);
          this.count.driverCount = dCount;
          this.count.mgrCount = mCount;
          this.count.vehicleCount = vCount;
          this.count.pumpCount = pCount;
          this.count.reqCount = rCount;
          //   console.log("notequal",this.count)
          this.events.publish('user:updated1', this.count);
        }

      })
    });

  }
}
