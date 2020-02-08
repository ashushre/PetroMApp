export class transporterReport {
    pumpId: number;
    ProductPumpId:number;

    //pumpwiseconsumed
    sales: any[];
    sumCashAmount: number;
    sumFuelAmount: number;
    sumtotalAmount: number;

    //pumpwisecreditLimit
    limitAllocated: number;
    usedLimit: number;
    balanceLimit: number;

    //pumpwisepayment
    sumDueBillAmount: number;
    sumPaid: number;
    sumPending: number;

    //pendingrequest
    requestCt: number;
    sumCash: number;

    //vehiclewise
    totalFuel: number;
    totalCash: number;
    total: number;
    getPumpList;
    getPumpWisePaymentReports;
    getPumpWiseCreditLimit;
    getPumpwiseConsumed;
    getPumpwisePendingRequest;
    getProductRatePumpWise;

    title = '';
    userType: number;
    transporterId: number;
    transRequestList: any;
    totalRequest: number;
    pendingRequest: number;
    vehicles: any;
    drivers: any;
    name: string;
    pumpList: any;
    shownGroup = null;
    vehicleId = 0;

    totPending:number;
    totPaid:number;
    totDueAmount:number;
    
  creditLimitList: any[] = [];
  consumedList: any[] = [];
  paymentList: any[] = [];

    constructor() {
    }
}