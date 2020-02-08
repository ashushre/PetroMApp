import { Time } from "@angular/common";

export class Product {
    id: number;
    name: string;
    pumpId: number;
    companyId: number;
    category: string;
    pointPerUnit: number;
    unit: number;
    rateTime:Time;
    unitName: string;
    currentRate: number;
    newRate: number;
    updated_by: string;
    effectiveDate:Date;
    effectiveTime:Time;
    prodrates;
    constructor() {

    }
}