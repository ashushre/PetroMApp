import { transporterReport } from './../../app/transporterReport';
import { HttpClient,HttpHeaders,  HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BasicDataProvider } from "../basic-data/basic-data";
import { Storage } from "@ionic/storage";
/*
  Generated class for the TransporterReportProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TransporterReportProvider {
  apiUrl;
  token:any;
  reqHeader:any;
  constructor(public http: HttpClient,
    public storage:Storage,
    public basicData:BasicDataProvider) {
    this.apiUrl = this.basicData.apiUrl;
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
    return Observable.throw(error.message || "Server Error");
  }
  getPumpWiseCreditLimit(transporterId,pumpId):Observable<transporterReport> {
    return this.http.get<transporterReport>(this.apiUrl+"/transporterreports/getPumpWiseCreditLimit/"+transporterId+"/"+pumpId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }

  getPumpwiseConsumed(transporterId, pumpId):Observable<transporterReport> {
    return this.http.get<transporterReport>(this.apiUrl+"/transporterreports/getPumpwiseConsumed/"+transporterId+"/"+pumpId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getPumpwiseConsumedDatewise(transporterId, pumpId,twoDate):Observable<transporterReport> {
    return this.http.get<transporterReport>(this.apiUrl+"/transporterreports/getPumpwiseConsumed/"+transporterId+"/"+pumpId+"/"+twoDate, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getPumpWisePaymentReports(transporterId, pumpId):Observable<transporterReport> {
    return this.http.get<transporterReport>(this.apiUrl+"/transporterreports/getPumpWisePaymentReports/"+transporterId+"/"+pumpId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getPumpWisePaymentReportsDatewise(transporterId, pumpId,twoDate):Observable<transporterReport> {
    return this.http.get<transporterReport>(this.apiUrl+"/transporterreports/getPumpWisePaymentReports/"+transporterId+"/"+pumpId+"/"+twoDate, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getPumpwisePendingRequest(transporterId,pumpId):Observable<transporterReport> {
    return this.http.get<transporterReport>(this.apiUrl+"/transporterreports/getPumpwisePendingRequest/"+transporterId+"/"+pumpId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getVehicleWiseConsumed(transporterId,pumpId,vehicleId,twodate):Observable<transporterReport> {
    return this.http.get<transporterReport>(this.apiUrl+"/transporterreports/getVehicleWiseConsumed/"+transporterId+"/"+pumpId+"/"+vehicleId+"/"+twodate, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  allRequest(transporterId, pumpId,productpumpId, vehicleId):Observable<transporterReport> {
    return this.http.get<transporterReport>(this.apiUrl+"/transporterreports/allRequest/"+transporterId+"/"+pumpId+"/"+productpumpId+"/"+vehicleId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
}
