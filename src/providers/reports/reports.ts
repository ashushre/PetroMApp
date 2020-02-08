import { HttpClient,HttpHeaders,  HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Reports } from "../../app/reports";
import { BasicDataProvider } from "../basic-data/basic-data";
import { EmployeeProfile } from '../../app/employeeProfile';
import { Storage } from "@ionic/storage";

@Injectable()
export class ReportsProvider {
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
      console.log(this.token);
    },err=>{
      console.log(err);
    });
  }

  errorHandler(error: HttpErrorResponse) {
    return Observable.throw(error.message || "Server Error");
  }

  getTopCustomers(pumpId):Observable<Reports[]> {
    return this.http.get<Reports[]>(this.apiUrl+"/loyaltySales/top10Drivers/"+pumpId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getLostDriver(pumpId,date):Observable<Reports[]> {
    return this.http.get<Reports[]>(this.apiUrl+"/loyaltySales/lostDrivers/"+pumpId+"/"+date, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getProductRatesList(pumpId):Observable<Reports[]> {
    return this.http.get<Reports[]>(this.apiUrl+"/productRates/list/"+pumpId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getCreditPayment(pumpId):Observable<Reports[]> {
    return this.http.get<Reports[]>(this.apiUrl+"/creditSales/creditPayments/"+pumpId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getCreditPaymentDate(pumpId,startDate,endDate):Observable<Reports[]> {
    return this.http.get<Reports[]>(this.apiUrl+"/creditSales/creditPayments/"+pumpId+"/"+startDate+"/"+endDate, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getEmployeeProfile(id):Observable<EmployeeProfile> {
    return this.http.get<EmployeeProfile>(this.apiUrl+"/employees/getProfile/"+id, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  updateEmployeeProfile(profile:EmployeeProfile, id): Observable<EmployeeProfile> { 
    const headers = new HttpHeaders().set('content-type', 'application/json');  
    return this.http.put<EmployeeProfile>(this.apiUrl+"/employees/"+id+"/saveProfile",profile, { headers: this.reqHeader }) 
      .catch(this.errorHandler); 
  }
  getPumpOwnerProfile(id):Observable<EmployeeProfile> {
    return this.http.get<EmployeeProfile>(this.apiUrl+"/pumps/getProfile/"+id)
      .catch(this.errorHandler);
  }
  updatePumpOwnerProfile(profile:EmployeeProfile, id): Observable<EmployeeProfile> { 
    const headers = new HttpHeaders().set('content-type', 'application/json');  
    return this.http.put<EmployeeProfile>(this.apiUrl+"/pumps/"+id+"/saveProfile",profile, { headers: this.reqHeader }) 
      .catch(this.errorHandler); 
  }
  getTransporterList(pumpId):Observable<Reports[]> {
    return this.http.get<Reports[]>(this.apiUrl+"/pumpreports/getTransporterList/"+pumpId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }


  getTransporterDetail(transporterId,pumpId):Observable<Reports> {
    return this.http.get<Reports>(this.apiUrl+"/pumpreports/getTransporterDetails/"+transporterId+"/"+pumpId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getTransporterStatwise(pumpId, regionId):Observable<Reports[]> {
    return this.http.get<Reports[]>(this.apiUrl+"/pumpreports/getTransporterStatwise/"+pumpId+"/"+regionId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getDefaulterTransporters(pumpId):Observable<Reports[]> {
    return this.http.get<Reports[]>(this.apiUrl+"/pumpreports/getDefaulterTransporters/"+pumpId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getPaymentDue( pumpId):Observable<Reports[]> {
    return this.http.get<Reports[]>(this.apiUrl+"/pumpreports/getPaymentDue/"+pumpId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getPaymentReceivedPaymodeWise(pumpId, paymode,twoDate):Observable<Reports> {
    return this.http.get<Reports>(this.apiUrl+"/pumpreports/getPaymentReceivedPaymodeWise/"+pumpId+"/"+paymode+"/"+twoDate, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getPaymentReceivedTranspWise(pumpId, transporterId, twoDate):Observable<Reports> {
    return this.http.get<Reports>(this.apiUrl+"/pumpreports/getPaymentReceivedTranspWise/"+pumpId+"/"+transporterId+"/"+twoDate, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getDefaulerTransporterList(pumpId):Observable<Reports[]> {
    return this.http.get<Reports[]>(this.apiUrl+"/pumpreports/getDefaulerTransporterList/"+pumpId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  // getPumpSummary(pumpId,productId):Observable<Reports[]> {
  //   return this.http.get<Reports[]>(this.apiUrl+"/pumpreports/getPumpSummary/"+pumpId+"/"+productId)
  //     .catch(this.errorHandler);
  // }
  getProductList(pumpId):Observable<Reports[]> {
    return this.http.get<Reports[]>(this.apiUrl+"/pumpreports/getProductList/"+pumpId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getOilPurchasedDatewise(pumpId,productId,twoDate):Observable<Reports> {
    return this.http.get<Reports>(this.apiUrl+"/pumpreports/getOilPurchased/"+pumpId+"/" +productId+"/"+twoDate, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getOilPurchased(pumpId,productId):Observable<Reports> {
    return this.http.get<Reports>(this.apiUrl+"/pumpreports/getOilPurchased/"+pumpId+"/" +productId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getOverallProductWise(pumpId, productId):Observable<Reports> {
    return this.http.get<Reports>(this.apiUrl+"/pumpreports/getOverallProductWise/"+pumpId+"/" +productId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getLoyaltySaleslastDashboard(pumpId):Observable<Reports> {
    return this.http.get<Reports>(this.apiUrl+"/pumpreports/getLoyaltySalesDashboard/"+pumpId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getCreditSaleslastDashboard(pumpId):Observable<Reports> {
    return this.http.get<Reports>(this.apiUrl+"/pumpreports/getCreditSalesDashboard/"+pumpId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }

  getCurrentOilStock(pumpId, productId):Observable<Reports> {
    return this.http.get<Reports>(this.apiUrl+"/pumpreports/getCurrentOilStock/"+pumpId+"/"+productId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  
  getRegularSaleslastDashboard(pumpId):Observable<Reports> {
    return this.http.get<Reports>(this.apiUrl+"/pumpreports/getRegularSalesDashboard/"+pumpId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getAllFuelSold(pumpId, twodate,productId):Observable<Reports> {
    return this.http.get<Reports>(this.apiUrl+"/pumpreports/getAllFuelSold/"+pumpId+"/"+twodate+"/"+productId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getALLFuelSoldPDF(pumpId, twodate,productId):Observable<Reports> {
    return this.http.get<Reports>(this.apiUrl+"/pumpreports/getAllFuelSoldPdf/"+pumpId+"/"+twodate+"/"+productId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getCreditGivenCashFuel(pumpId, transporterId, twodate):Observable<Reports> {
    return this.http.get<Reports>(this.apiUrl+"/pumpreports/getCreditGivenCashFuel/"+pumpId + "/"+transporterId+"/"+twodate, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getLoyaltyFuelSoldQtyAmt(pumpId, productId, twodate):Observable<Reports> {
    return this.http.get<Reports>(this.apiUrl+"/pumpreports/getLoyaltyFuelSoldQtyAmt/"+pumpId+ "/"+productId+"/"+twodate, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getPaymodeWiseSales(pumpId, paymodeId):Observable<Reports> {
    return this.http.get<Reports>(this.apiUrl+"/pumpreports/getPaymodeWiseSales/"+pumpId+ "/"+paymodeId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
   getLoyaltySaleSummary(pumpId, driverId, twodate):Observable<Reports> {
    return this.http.get<Reports>(this.apiUrl+"/pumpreports/getLoyaltySaleSummary/"+pumpId+ "/"+driverId +"/"+twodate, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
  getLDriverList(pumpId):Observable<Reports[]> {
    return this.http.get<Reports[]>(this.apiUrl+"/pumpreports/getLDriverList/"+pumpId, { headers: this.reqHeader })
      .catch(this.errorHandler);
  }
getpaymentDueCashFuel(pumpId, transporterId,twodate):Observable<Reports> {
  return this.http.get<Reports>(this.apiUrl+"/pumpreports/getpaymentDueCashFuel/"+pumpId+ "/"+transporterId+"/"+twodate, { headers: this.reqHeader })
    .catch(this.errorHandler);
}
getOldProductRates(pumpId,productId,startDate,endDate):Observable<Reports[]> {
  return this.http.get<Reports[]>(this.apiUrl+"/productRates/getOldProductRates/"+pumpId+ "/"+productId+ "/"+startDate + "/"+endDate, { headers: this.reqHeader })
    .catch(this.errorHandler);
}

getOilStock(pumpId,productId):Observable<Reports> {
  return this.http.get<Reports>(this.apiUrl+"/pumpMgrsReport/getOilStock/"+pumpId+"/"+productId, { headers: this.reqHeader })
    .catch(this.errorHandler);
}
getShifts(pumpId):Observable<Reports>
{
  return this.http.get<Reports>(this.apiUrl+"/pumpmgrsreport/getShifts/"+pumpId, { headers: this.reqHeader })
  .catch(this.errorHandler);
}
getPumpShifts(pumpId,machineId):Observable<Reports>
{
  return this.http.get<Reports>(this.apiUrl+"/pumpreports/getShifts/"+pumpId+ "/"+machineId, { headers: this.reqHeader })
  .catch(this.errorHandler);
}
getMachine(pumpId):Observable<Reports[]>
{
  return this.http.get<Reports[]>(this.apiUrl+"/pumpreports/getMachine/"+pumpId, { headers: this.reqHeader })
  .catch(this.errorHandler);
}
allDashboardReports(pumpId, productId, paymodeId):Observable<Reports>
{
  console.log(this.token,this.reqHeader);
  return this.http.get<Reports>(this.apiUrl+"/pumpreports/allDashboardReports/"+pumpId+ "/"+productId+ "/"+paymodeId, { headers: this.reqHeader })
  .catch(this.errorHandler);
}
getDSRReport(pumpId,productId,twoDate):Observable<Reports[]>
{
  return this.http.get<Reports[]>(this.apiUrl+"/pumpreports/getDSRReport/"+pumpId+"/"+productId+"/"+twoDate, { headers: this.reqHeader })
  .catch(this.errorHandler);
}
getExpense(pumpId,twoDate):Observable<Reports[]>
{
  return this.http.get<Reports[]>(this.apiUrl+"/pumpreports/getExpense/"+pumpId+"/"+twoDate, { headers: this.reqHeader })
  .catch(this.errorHandler);
}
getNozzleTesting(pumpId,twoDate):Observable<Reports[]>
{
  return this.http.get<Reports[]>(this.apiUrl+"/pumpreports/getNozzleTesting/"+pumpId+"/"+twoDate, { headers: this.reqHeader })
  .catch(this.errorHandler);
}
getSmsCount(pumpId):Observable<Reports>
{
  return this.http.get<Reports>(this.apiUrl+"/pumpreports/getSmsCount/"+pumpId, { headers: this.reqHeader })
  .catch(this.errorHandler);
}
getmanagerManual(): Observable<Reports[]> {

  return this.http.get<Reports[]>(this.apiUrl + "/pumpmanual", { headers: this.reqHeader })
    .catch(this.errorHandler);
}

getRegular(pumpId,productId): Observable<Reports[]> {

  return this.http.get<Reports[]>(this.apiUrl + "/pumpreports/getRegularSales/"+pumpId+"/"+productId, { headers: this.reqHeader })
    .catch(this.errorHandler);
}


}