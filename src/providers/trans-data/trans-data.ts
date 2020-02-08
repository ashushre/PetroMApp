import { TransporterProfile } from './../../app/transporterProfile';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import { TDriver } from '../../app/tdriver';
import { Vehicle } from '../../app/vehicle';
import { Manager } from '../../app/manager';
import { Transporter } from '../../app/transporter';
import { CreditSale } from '../../app/credit.sale';
import { BasicDataProvider } from '../basic-data/basic-data';
import { PaymentEntry } from '../../app/paymentEntry';
import { Storage } from '@ionic/storage';

/*
  Generated class for the TransDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TransDataProvider {
  apiUrl;
  token:any;
  reqHeader:any;
  constructor(public http: HttpClient,
    public storage:Storage,
    public basicData:BasicDataProvider) {
    this.apiUrl = this.basicData.apiUrl;
    this.storage.get('token').then((val) => {
      this.token = val;
      this.reqHeader= new HttpHeaders({
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

  getTDrivers(transporterId):Observable<TDriver[]> {
    return this.http.get<TDriver[]>(this.apiUrl+"/tdrivers/list/"+transporterId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }

  getTDriver(id):Observable<TDriver> {
    return this.http.get<TDriver>(this.apiUrl+"/tdrivers/"+id, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }

  getTDriverActivate(id):Observable<TDriver> {
    return this.http.get<TDriver[]>(this.apiUrl+"/tdrivers/"+id+"/activate", { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getTDriverDeactivate(id):Observable<TDriver> {
    return this.http.get<TDriver[]>(this.apiUrl+"/tdrivers/"+id+"/deactivate", { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  addTDriver(tdriver:TDriver): Observable<TDriver> {   
    return this.http.post<TDriver>(this.apiUrl+"/tdrivers/store", tdriver, { headers: this.reqHeader }) 
      .catch(this.errorHandler); 
  }

  updateTDriver(tdriver:TDriver, id): Observable<Vehicle> { 
    const headers = new HttpHeaders().set('content-type', 'application/json');  
    return this.http.put<Vehicle>(this.apiUrl+"/tdrivers/"+id+"/update", tdriver, { headers: this.reqHeader }) 
      .catch(this.errorHandler); 
  }

  getVehicles(pumpId, transporterId):Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.apiUrl+"/vehicles/"+pumpId+"/"+transporterId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }

  getVehicle(id):Observable<Vehicle> {
    return this.http.get<Vehicle>(this.apiUrl+"/vehicles/"+id, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }

  addVehicle(vehicle:Vehicle): Observable<Vehicle> { 
    const headers = new HttpHeaders().set('content-type', 'application/json');  
    
    return this.http.post<Vehicle>(this.apiUrl+"/vehicles/store", vehicle, { headers: this.reqHeader }) 
      .catch(this.errorHandler); 
  }

  updateVehicle(vehicle:Vehicle, id): Observable<Vehicle> { 
    const headers = new HttpHeaders().set('content-type', 'application/json');  
    return this.http.put<Vehicle>(this.apiUrl+"/vehicles/"+id+"/update", vehicle, { headers: this.reqHeader }) 
      .catch(this.errorHandler); 
  }
  getVehicleDeactivate(id):Observable<TDriver> {
    return this.http.get<TDriver[]>(this.apiUrl+"/vehicles/"+id+"/deactivate", { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getVehicleActivate(id):Observable<TDriver> {
    return this.http.get<TDriver[]>(this.apiUrl+"/vehicles/"+id+"/activate", { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getManagers( transporterId):Observable<Manager[]> {
    return this.http.get<Manager[]>(this.apiUrl+"/tmanagers/list/"+transporterId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }

  getManager(id):Observable<Manager> {
    return this.http.get<Manager>(this.apiUrl+"/tmanagers/"+id, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }

  addManager(manager:Manager): Observable<Manager> { 
    const headers = new HttpHeaders().set('content-type', 'application/json');  
    
    return this.http.post<Manager>(this.apiUrl+"/tmanagers/store", manager, { headers: this.reqHeader }) 
      .catch(this.errorHandler); 
  }

  updateManager(manager:Manager, id): Observable<Manager> { 
    const headers = new HttpHeaders().set('content-type', 'application/json');  
    return this.http.put<Manager>(this.apiUrl+"/tmanagers/"+id+"/update", manager, { headers: this.reqHeader }) 
      .catch(this.errorHandler); 
  }
  getManagerDeactivate(id):Observable<Manager> {
    return this.http.get<Manager[]>(this.apiUrl+"/tmanagers/"+id+"/deactivate", { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getManagerActivate(id):Observable<Manager> {
    return this.http.get<Manager[]>(this.apiUrl+"/tmanagers/"+id+"/activate", { headers: this.reqHeader })
      .catch(this.errorHandler);
  }

  getTransporters(pumpId):Observable<Transporter[]> {
    return this.http.get<Transporter[]>(this.apiUrl+"/pumps/getTransporters/"+pumpId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }

  getTransporter(id):Observable<Transporter> {
    return this.http.get<Transporter>(this.apiUrl+"/transporters/"+id, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }

  updateTransporter(transporter:Transporter, id): Observable<Transporter> { 
    const headers = new HttpHeaders().set('content-type', 'application/json');  
    return this.http.put<Transporter>(this.apiUrl+"/transporters/"+id+"/update", transporter, { headers: this.reqHeader }) 
      .catch(this.errorHandler); 
  }

  getTransRequests(transporterId):Observable<Transporter[]> {
    return this.http.get<Transporter[]>(this.apiUrl+"/creditSales/transRequests/"+transporterId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getTransRequestsDate(transporterId,startDate,endDate):Observable<Transporter[]> {
    return this.http.get<Transporter[]>(this.apiUrl+"/creditSales/transRequests/"+transporterId+"/"+startDate+"/"+endDate, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  showTransRequests(req_id):Observable<CreditSale> {
    return this.http.get<CreditSale>(this.apiUrl+"/creditSales/showRequest/"+req_id, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  editTransRequests(cRequest:CreditSale,req_id): Observable<CreditSale[]> { 
    const headers = new HttpHeaders().set('content-type', 'application/json');  
    return this.http.put<CreditSale>(this.apiUrl+"/creditSales/"+req_id +"/editRequest",cRequest, { headers: this.reqHeader }) 
      .catch(this.errorHandler); 
  }
  cancelTransRequests(cRequest:Transporter,req_id): Observable<Transporter[]> { 
    const headers = new HttpHeaders().set('content-type', 'application/json');  
    return this.http.put<Transporter>(this.apiUrl+"/creditSales/"+req_id +"/cancelRequest",cRequest, { headers: this.reqHeader }) 
      .catch(this.errorHandler); 
  }
  getPumpList(transporterId):Observable<Transporter[]>{
    return this.http.get<Transporter[]>(this.apiUrl+"/creditSales/pumpList/"+transporterId, { headers: this.reqHeader })
    .catch(this.errorHandler);
  }
  flagInsert(reqId): Observable<CreditSale> { 
    const headers = new HttpHeaders().set('content-type', 'application/json');  
    return this.http.post<CreditSale>(this.apiUrl+"/creditSales/"+reqId +"/flagInsert", { headers: this.reqHeader }) 
      .catch(this.errorHandler); 
  } 
   flagRemove(reqId): Observable<CreditSale> { 
    const headers = new HttpHeaders().set('content-type', 'application/json');  
    return this.http.post<CreditSale>(this.apiUrl+"/creditSales/"+reqId +"/flagRemove", { headers: this.reqHeader }) 
      .catch(this.errorHandler); 
  }

  getTransTotal(transporterId):Observable<Transporter> {

    return this.http.get<Transporter>(this.apiUrl+"/creditSales/transTotals/"+transporterId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getRaiseRequest(credit: CreditSale): Observable<CreditSale> { 
    const headers = new HttpHeaders().set('content-type', 'application/json');  
    return this.http.post<any>(this.apiUrl+"/creditSales/raiseRequest", credit, { headers: this.reqHeader }) 
      .catch(this.errorHandler); 
  } 
  getFuel(transporterId):Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.apiUrl+"/creditSales/fuelList/"+transporterId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getFuelType():Observable<TDriver[]> {
    return this.http.get<TDriver[]>(this.apiUrl+"/vehicles/fuelTypes", { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getVehicleType():Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.apiUrl+"/vehicles/vehicleTypes", { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getTransporterProfile(id):Observable<TransporterProfile> {
    return this.http.get<TransporterProfile>(this.apiUrl+"/transporters/getProfile/"+id, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  updateTransporterProfile(tprofile:TransporterProfile, id): Observable<TransporterProfile> { 
    return this.http.put<TransporterProfile>(this.apiUrl+"/transporters/"+id+"/saveProfile", tprofile, { headers: this.reqHeader }) 
      .catch(this.errorHandler); 
  }
  getTManagerProfile(id):Observable<TransporterProfile> {
    return this.http.get<TransporterProfile>(this.apiUrl+"/tmanagers/getProfile/"+id, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  updateTManagerProfile(tprofile:TransporterProfile, id): Observable<TransporterProfile> { 
    const headers = new HttpHeaders().set('content-type', 'application/json');  
    return this.http.put<TransporterProfile>(this.apiUrl+"/tmanagers/"+id+"/saveProfile", tprofile, { headers: this.reqHeader }) 
      .catch(this.errorHandler); 
  }
  getTransporterPumpList(transporterId): Observable<Transporter[]> { 
    const headers = new HttpHeaders().set('content-type', 'application/json');  
    return this.http.get<Transporter[]>(this.apiUrl+"/transporters/getTransporterPumpList/"+transporterId, { headers: this.reqHeader }) 
      .catch(this.errorHandler); 
  }
  getPumpTransporter(pumpId,transporterId): Observable<Transporter> { 
    const headers = new HttpHeaders().set('content-type', 'application/json');  
    return this.http.get<Transporter>(this.apiUrl+"/pumps/getPumpTransporter/"+pumpId+"/"+transporterId, { headers: this.reqHeader }) 
      .catch(this.errorHandler); 
  } 
 
  getTransporterCt(transporterId): Observable<Transporter> { 
    const headers = new HttpHeaders().set('content-type', 'application/json');  
    return this.http.get<Transporter>(this.apiUrl+"/transporters/getTransporterCt/"+transporterId, { headers: this.reqHeader }) 
      .catch(this.errorHandler); 
  }
 
  getCreditBillList(transporterId): Observable<Transporter[]> { 
    const headers = new HttpHeaders().set('content-type', 'application/json');  
    return this.http.get<Transporter[]>(this.apiUrl+"/transporters/getCreditBillList/"+transporterId, { headers: this.reqHeader }) 
      .catch(this.errorHandler); 
  }
  getBillDetails(creditBillId): Observable<Transporter> { 
    const headers = new HttpHeaders().set('content-type', 'application/json');  
    return this.http.get<Transporter>(this.apiUrl+"/transporters/getBillDetails/"+creditBillId, { headers: this.reqHeader }) 
      .catch(this.errorHandler); 
  }

  getAdvanceBillDetails(transporterId,pumpId): Observable<Transporter> { 
    const headers = new HttpHeaders().set('content-type', 'application/json');  
    return this.http.get<Transporter>(this.apiUrl+"/transporters/getAdvanceDetails/"+transporterId+"/"+pumpId, { headers: this.reqHeader }) 
      .catch(this.errorHandler); 
  }

  updateBillPayment(request:Transporter): Observable<CreditSale> { 
    const headers = new HttpHeaders().set('content-type', 'application/json');  
    return this.http.post<CreditSale>(this.apiUrl+"/transporters/updateBillPayment", request, { headers: this.reqHeader }) 
      .catch(this.errorHandler); 
  }


  getPaymentPumpList(tranporterId): Observable<Transporter[]> { 
    const headers = new HttpHeaders().set('content-type', 'application/json');  
    return this.http.get<Transporter[]>(this.apiUrl+"/transporters/getPaymentPumpList/"+tranporterId, { headers: this.reqHeader }) 
      .catch(this.errorHandler); 
  }

  getLastPayments(tranporterId,pumpId): Observable<Transporter[]> { 
    const headers = new HttpHeaders().set('content-type', 'application/json');  
    return this.http.get<Transporter[]>(this.apiUrl+"/transporters/getLastPayments/"+tranporterId+"/"+pumpId, { headers: this.reqHeader }) 
      .catch(this.errorHandler); 
  }
  storeAdvancePayments(transporter:Transporter): Observable<Manager> { 
    const headers = new HttpHeaders().set('content-type', 'application/json');  
    
    return this.http.post<Manager>(this.apiUrl+"/transporters/storeAdvancePayments", transporter, { headers: this.reqHeader }) 
      .catch(this.errorHandler); 
  }

  getBillDetail(pumpId,transporterId): Observable<PaymentEntry> { 
    const headers = new HttpHeaders().set('content-type', 'application/json');  
    return this.http.get<PaymentEntry>(this.apiUrl+"/creditSales/getBillDetail/"+pumpId+"/"+transporterId, { headers: this.reqHeader }) 
      .catch(this.errorHandler); 
  }

  storePayment(payMent:PaymentEntry):Observable<PaymentEntry>
  {
    const headers = new HttpHeaders().set('content-type', 'application/json');  
    
    return this.http.post<PaymentEntry>(this.apiUrl+"/creditSales/savePayment", payMent, { headers: this.reqHeader }) 
      .catch(this.errorHandler);
  }
  //Route::get('transporters/getLastPayments/{transporterId}/{pumpId}', 'Api\TransportersController@getLastPayments');	
 // http://5.1.66.221/api/creditSales/savePayment
}
