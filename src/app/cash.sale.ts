import { DateTime } from "ionic-angular";

export class CashSale {
    id: number;
    cardId: number;
    pumpId: number;
    productId: number;
    employeeId: number;
    quantity: number;
    vehicleNo:any;
    amount: number;
    fuelCapacity:string;
    invoiceNo: string;
    fuelUnit: number;
    earnedPoints: number;
    created_at?: DateTime;
    updated_at?: DateTime;
    updated_by: string;
    mobileNo: any;
    payModeId: number;
    driverMobileNo: number;
    empShiftId: number;
    DSMId: number;
    machineId: number;
    nozzleId: number;
    unitName: string;
    managerId: number;
    username:string;
    currentRate: number;
    vehicleChanged:boolean;
    selectNozzle:boolean;
    shortName:String;
    machineName:String;
    nozzleName:String;
    detail:boolean;
    vehiclePhoto:string;
 
  // public amount: number;

    constructor() {
        this.fuelUnit = 1;
    }
}