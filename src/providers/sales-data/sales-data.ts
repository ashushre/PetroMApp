import { singleSale } from './../../app/singleSale';
import { CreditSale } from './../../app/credit.sale';
import { Vehicle } from './../../app/vehicle';
import { Manager } from '../../app/manager';
import { Transporter } from '../../app/transporter';
import { Driver } from '../../app/driver';
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import { Product } from '../../app/product';
import { CashSale } from '../../app/cash.sale';
import { RegularSale } from '../../app/regular-sale';
import { CashDispense } from '../../app/cash.dispense';
import { BasicDataProvider } from '../basic-data/basic-data';
import { EmployeeNozzle } from '../../app/employee.nozzle';
import { Storage } from '@ionic/storage';
/*
  Generated class for the SalesDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SalesDataProvider {
  apiUrl;
  amount:number;
  token:any;
  reqHeader:any;
  constructor(public http: HttpClient,
    public storage:Storage,
     public basicData: BasicDataProvider) {
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

  getProducts(pumpId): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl + "/products/" + pumpId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }

  getProduct(id): Observable<Product> {
    return this.http.get<Product>(this.apiUrl + "/products/" + id, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }

  getDrivers(pumpId): Observable<Driver[]> {
    return this.http.get<Driver[]>(this.apiUrl + "/drivers/" + pumpId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }

  getDriver(id): Observable<Driver> {
    return this.http.get<Driver>(this.apiUrl + "/products/" + id, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }

  getVehicles(transporterId): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.apiUrl + "/vehicles/list/" + transporterId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }

  getVehicle(id): Observable<Vehicle> {
    return this.http.get<Vehicle>(this.apiUrl + "/vehicles/" + id, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }

  addVehicle(vehicle: Vehicle): Observable<Vehicle> {
    const headers = new HttpHeaders().set('content-type', 'application/json');

    return this.http.post<Vehicle>(this.apiUrl + "/vehicles/store", vehicle, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }

  updateVehicle(vehicle: Vehicle, id): Observable<Vehicle> {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http.put<Vehicle>(this.apiUrl + "/vehicles/" + id + "/update", vehicle, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }

  getManagers(pumpId, transporterId): Observable<Manager[]> {
    return this.http.get<Manager[]>(this.apiUrl + "/tmanagers/" + pumpId + "/" + transporterId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }

  getManager(id): Observable<Manager> {
    return this.http.get<Manager>(this.apiUrl + "/tmanagers/" + id, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }

  addManager(manager: Manager): Observable<Manager> {
    const headers = new HttpHeaders().set('content-type', 'application/json');

    return this.http.post<Manager>(this.apiUrl + "/tmanagers/store", manager, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }

  updateManager(manager: Manager, id): Observable<Manager> {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http.put<Manager>(this.apiUrl + "/tmanagers/" + id + "/update", manager, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }

  getTransporters(pumpId): Observable<Transporter[]> {
    return this.http.get<Transporter[]>(this.apiUrl + "/transporters/getTransporters/" + pumpId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }

  getTransporter(id): Observable<Transporter> {
    return this.http.get<Transporter>(this.apiUrl + "/transporters/" + id, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }

  updateTransporter(transporter: Transporter, id): Observable<Transporter> {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http.put<Transporter>(this.apiUrl + "/transporters/" + id + "/update", transporter, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }

  getRequests(pumpId): Observable<CreditSale[]> {
    return this.http.get<CreditSale[]>(this.apiUrl + "/creditSales/pumpRequests/" + pumpId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }

  getDSMRequest(pumpId, regNo): Observable<CreditSale> {
    return this.http.get<CreditSale>(this.apiUrl + "/creditSales/getDSMRequest/" + pumpId + "/" + regNo, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }

  getDSMBlanketRequest(pumpId, regNo, username,DSMID,transporterId): Observable<CreditSale> {
    return this.http.get<CreditSale[]>(this.apiUrl + "/creditSales/getDSMBlanket/" + pumpId + "/" + regNo + "/" + username+ "/" + DSMID + "/" + transporterId, { headers: this.reqHeader } )
      .catch(this.errorHandler);
  }

  showRequest(id): Observable<CreditSale> {
    return this.http.get<CreditSale>(this.apiUrl + "/creditSales/showRequest/" + id, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getProductRates(pumpId): Observable<CreditSale[]> {
    return this.http.get<CreditSale[]>(this.apiUrl + "/productRates/dpRates/" + pumpId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }

  getDSMNozzles(pumpId, employeeId, isTotalizer): Observable<EmployeeNozzle[]> {
    return this.http.get<EmployeeNozzle[]>(this.apiUrl + "/empShifts/getDSMNozzles/" + pumpId + "/" + employeeId + "/" + isTotalizer, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }

  // getCheckNozzle(pumpId,employeeId):Observable<Employee[]> {
  //   return this.http.get<Employee[]>(this.apiUrl+"/empShifts/checkNozzle/"+pumpId +"/" +employeeId)
  //     .catch(this.errorHandler);
  // }

  getFuelDispense(requestId, crequest: CreditSale): Observable<CreditSale[]> {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http.post<CreditSale[]>(this.apiUrl + "/creditSales/" + requestId + "/fuelDispense", crequest, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }

  addCashSale(cashsale: CashSale): Observable<CashSale> {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http.post<CashSale>(this.apiUrl + "/loyaltySales/store", cashsale, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }

  getCashDispense(requestId, cashsale: CashDispense): Observable<CashDispense> {
    const headers = new HttpHeaders().set('content-type', 'application/json');

    return this.http.post<CashSale>(this.apiUrl + "/creditSales/" + requestId + "/cashDispense", cashsale, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }

  getPayMode(): Observable<RegularSale[]> {
    return this.http.get<RegularSale[]>(this.apiUrl + "/productRates/paymodes", { headers: this.reqHeader })
      .catch(this.errorHandler);
  }

  getPayModeLoyality(pumpId, employeeId, empShiftId, saleType): Observable<RegularSale[]> {
    return this.http.get<RegularSale[]>(this.apiUrl + "/empShifts/payModeWiseSales/" + pumpId + "/" + employeeId + "/" + empShiftId + "/" + saleType, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }

  gelLoyaltyDriver(pumpId): Observable<Driver[]> {
    return this.http.get<Driver[]>(this.apiUrl + "/loyaltySales/loyalDrivers/" + pumpId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }

  getCashDriverRequest(pumpId, mobileNo): Observable<Driver[]> {
    return this.http.get<Driver[]>(this.apiUrl + "/loyaltySales/showDriver/" + pumpId + "/" + mobileNo, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  
  getManagerRequest(pumpId, regNo): Observable<CreditSale[]> {
    return this.http.get<CreditSale[]>(this.apiUrl + "/creditSales/getMgrRequest/" + pumpId + "/" + regNo, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }

  getTotalSales(pumpId, empShiftId, employeeId): Observable<RegularSale[]> {
    return this.http.get<RegularSale[]>(this.apiUrl + "/empShifts/totalSales/" + pumpId + "/" + empShiftId + "/" + employeeId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  sendOTPForBlanket(pumpId, tdriverId, regNo,updatedBy): Observable<CreditSale> {
    return this.http.get<CreditSale[]>(this.apiUrl + "/creditSales/sendOTPForBlanket/" + pumpId + "/" + tdriverId + "/" + regNo + "/" + updatedBy , { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getPendingCash(pumpId, employeeId, empShiftId){
    return this.http.get(this.apiUrl + "/empShifts/getPendingCash/" + pumpId + "/" + employeeId + "/" + empShiftId, { headers: this.reqHeader } )
      .catch(this.errorHandler);
  }
  saveSingleSale(singlesale: singleSale): Observable<CashDispense> {
    const headers = new HttpHeaders().set('content-type', 'application/json');

    return this.http.post<CashSale>(this.apiUrl + "/singleSales/store", singlesale, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
 // post('singleSaleEntry/saveSingleSale', 'Api\SingleSaleEntryController@saveSingleSale');
}
