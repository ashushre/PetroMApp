
export class DSMReports {
  

    //variables
    total: number;
    pumpId: number;
    employeeId: number;
    flag:number;
    username: string;
    activeCS: number;
    activeLS: number;
    name: string;
    empShiftId: number;
    isTotalizer: number = 0;
    transporterId;
    countryId: number;
    regionId: number;
    cityId: number;
    error: any;
    show: boolean;
    hide: boolean;
    start: Date;
    saleId: number = 0;
    view: boolean = false;
    showRecord: boolean = false;
    productId: number;
    parameter:any;
    totalAmount: number;

    sampleList: any[] = [];
    credit: number;
    loyality: number;
    totalTesting:number;
    regularCash: any;
    loySale: any;
    toFix: any;
    pendingAmount: number;
    showPending: boolean;
    managerId: number;
    totalCashPayable: any;
    cashDifference: any;
    loyalitySale: any[] = [];
    payModeList: any[];
    payMentList: any[];
    amount: any;
  
    loyaltyHide: boolean;
    shiftId: any;
    balanceAmount: number;
    totalBalance: number;
    sample = 0;
    saleType = 2;
    //arrays
    dsmReportList: any[] = [];
    countries = [];
    regions = [];
    selectedRegions = [];
    cities = [];
    selectedCities = [];
    NoozleList: any[];
    PayModeWiseDetail: any[] = [];
    currentDate: any;
    tDate: any;
    eDate: any;
    sDate: any;
    productList: any;
    startDate: any;
    endDate: any;
    userPhoto: any;

    cashtoSubmitted: any;
    getCashSubmitted:any;
    shiftTime:Date;
    userType: any;
    statusCheck:any;


    success: any;
    selectList: any;

    showEmpty: boolean;
    cb_vehicelchanged: boolean = false;totalLoyaltySale: any;
;
    hideTakePhotoButton: boolean = false;
    paymodeList: any[] = [];
    nozzleList: any[] = [];
    nozzleListFilter:any[]=[];
    creditSales:any[]=[];
    totalCreditSales;
    loyaltySales:any[]=[]
    machine:any[]=[];
    apiUrl: any;
    status:number;
    productName: string;
    showProductboolean: boolean = false;
    myphoto: any;
    selectp: Boolean = false;
    query = '';

      //objects
      creditSold;
      loyaltySold;
      regularSold;
      shifts;
      machines;
      productSales;
    getDSMFuelSale;
    shiftStatus;
    getPendingCash;
    getDSMSale;
    totalSales;
    getDSMNozzles;
    constructor() {

    }
}