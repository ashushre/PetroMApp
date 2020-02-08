import { CreditSale } from './../../app/credit.sale';
import { HttpClient, HttpHeaders,HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import {PaymentReminder} from '../../app/paymentReminder';
import { PaymentEntry } from '../../app/paymentEntry';
import { BasicDataProvider } from '../basic-data/basic-data';
import { Storage } from "@ionic/storage";
/*
  Generated class for the CreditDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CreditDataProvider {
 
public apiUrl;
token:any;
reqHeader:any;
  
  constructor(public http: HttpClient, 
    public storage: Storage,
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

  getTransTotal(transporterId):Observable<CreditSale[]> {
    return this.http.get<CreditSale[]>(this.apiUrl+"/creditSales/transTotals/"+transporterId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getPaymentReminder(pumpId):Observable<PaymentReminder[]> {
    return this.http.get<PaymentReminder[]>(this.apiUrl+"/creditSales/creditorList/"+pumpId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  sendPaymentReminder(regular):Observable<PaymentReminder>{
    const headers = new HttpHeaders().set('content-type', 'application/json');  
    return this.http.post<PaymentReminder>(this.apiUrl+"/creditSales/sendReminder",regular, { headers: this.reqHeader }) 
    .catch(this.errorHandler); 
  }

  getRequests(pumpId):Observable<CreditSale[]> {
    return this.http.get<CreditSale[]>(this.apiUrl+"/creditSales/getRequests/"+pumpId)
      .catch(this.errorHandler);
  }
  showRequest(id):Observable<CreditSale> {
    return this.http.get<CreditSale>(this.apiUrl+"/creditSales/showRequest/"+id)
      .catch(this.errorHandler);
  }
  getCreditBills(pumpId,transporterId,billType):Observable<CreditSale[]> {
    return this.http.get<CreditSale[]>(this.apiUrl+"/creditSales/creditBill/"+pumpId+"/"+transporterId+"/"+billType)
      .catch(this.errorHandler);
  }
  saveCreditBills(payment):Observable<PaymentEntry>{
    const headers = new HttpHeaders().set('content-type', 'application/json');  
    return this.http.post<PaymentEntry>(this.apiUrl+"/creditSales/savePayment",payment, { headers: this.reqHeader }) 
    .catch(this.errorHandler); 
  }
  // saveImageUpload(myphoto):Observable<>{
  //   let options: FileUploadOptions = {
  //     fileKey: 'photo',
  //     fileName: "myImage_" + random + ".jpg",
  //     chunkedMode: false,
  //     httpMethod: 'post',
  //     mimeType: "image/jpeg",
  //     headers: {}
  //   }
  //   const fileTransfer: FileTransferObject = this.transfer.create();
  //   fileTransfer.upload(myphoto,this.apiUrl+"", options)
  //   .then((data) => {
  //     alert("Success");
  //     loader.dismiss();
  //   }, (err) => {
  //     console.log(err);
  //     alert("Error");
  //     loader.dismiss();
  //   });
  // }
}
