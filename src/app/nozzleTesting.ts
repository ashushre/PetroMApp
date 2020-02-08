import { DateTime } from "ionic-angular";

export class NozzleTesting {
    id: number;
    pumpId: number;
    machineId:number;
    Nname:string;
    employeeId: number;
    nozzleId:number;
    testQty:number;
    empNid:number;
    ReadOTrue:number;
    employeeName: string;
    leaveId: number;
    status: number;
    created_at: DateTime
    updated_by: string;
    mNozzles;
    success:any;

    machine:any;
    nozzleName:string;
    //employeeName:any;
    nozzle:any[]=[];
    innerList:any[]=[]
    sampleList:any[]=[];
    constructor() {
    }

  
}