export class PaymentEntry{
   public pumpId:number;
   public creditBillId:number;
   public transporterId:number;
   public paymentType:number;
   public paymentAmount:number;
   public payModeId:number;
   public updated_by:string;
   public forDate:any;
   public billNo:number;
   public billType:number;
   public pendingCashAmount:number;
   public pendingFuelAmount:number;
   public advPendingAmount:number;
   public pendingAmount:number;
   public advOpeningBalance:number;
   public paymentDate:Date;
   public chequeDate:Date;
   public chequeNo:any;
   public amount:number;
   public remarks:string;
   public status:number;
   cashBill;
   opening;
   fuelBill;
   pumpTransporter;
  error: any;
   
}