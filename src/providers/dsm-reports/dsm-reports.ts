import { DSMReports } from './../../app/DSMReports';
import { HttpClient,HttpHeaders,  HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BasicDataProvider } from "../basic-data/basic-data";
import { Storage } from "@ionic/storage";
/*
  Generated class for the DsmReportsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DsmReportsProvider {
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
  getDSMFuelSale(pumpId, employeeId):Observable<DSMReports[]> {
    return this.http.get<DSMReports[]>(this.apiUrl+"/empShifts/getDSMFuelSale/"+pumpId+"/"+employeeId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getDSMSale(pumpId,employeeId): Observable<DSMReports> {
    return this.http.get<DSMReports>(this.apiUrl + "/empShifts/getDSMSale/" + pumpId + "/" + employeeId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getDayWiseSale(pumpId,employeeId,twodate): Observable<DSMReports> {
    return this.http.get<DSMReports>(this.apiUrl + "/dsmreports/getDayWiseSale/" + pumpId + "/" + employeeId + "/" + twodate, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getPaymodeWiseSale(employeeId,saleId,twodate): Observable<DSMReports> {
    return this.http.get<DSMReports>(this.apiUrl + "/dsmreports/getPaymodeWiseSale/" + employeeId + "/" + saleId + "/" + twodate, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }  
  getDSMDashboard(parameter): Observable<DSMReports> {
    return this.http.get<DSMReports>(this.apiUrl + "/empShifts/getDSMDashboard/" + parameter, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }  
  getShiftCreditSales(pumpId, empShiftId): Observable<DSMReports> {
    return this.http.get<DSMReports>(this.apiUrl + "/dsmreports/getShiftCreditSales/" + pumpId +"/" +empShiftId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }  
  getShiftLoyaltySales(pumpId, empShiftId): Observable<DSMReports> {
    return this.http.get<DSMReports>(this.apiUrl + "/dsmreports/getShiftLoyaltySales/" + pumpId +"/" +empShiftId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  } 
  getConfirmation(pumpId,empShiftId):Observable<DSMReports>
{
  return this.http.get<DSMReports>(this.apiUrl+"/empShifts/getConfirmation/"+pumpId+"/"+empShiftId, { headers: this.reqHeader })
  .catch(this.errorHandler);
}

getdsmManual():Observable<DSMReports[]>
{
  return this.http.get<DSMReports[]>(this.apiUrl+"/dsmmanual", { headers: this.reqHeader })
  .catch(this.errorHandler);
}
//http://5.1.66.221/api/dsmmanual
//Route::get('/pumpmanual', 'Api\PumpReportsController@getPumpMaual');
}
