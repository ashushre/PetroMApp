import { Storage } from '@ionic/storage';
import { PumpDataProvider } from '../../../providers/pump-data/pump-data';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DsmHomePage } from '../dsm-home/dsm-home';
import { singleSale } from '../../../app/singleSale';
import { FormGroup, FormControl ,Validators} from '@angular/forms';
import { SalesDataProvider } from '../../../providers/sales-data/sales-data';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';

/**
 * Generated class for the OtherSalesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-single-sales',
  templateUrl: 'single-sales.html',
})
export class SingleSalesPage {
userInfo=new singleSale();
toFix:any;
user: FormGroup;
  constructor(public navCtrl: NavController,
    public pumpData:PumpDataProvider, 
    public basicData:BasicDataProvider,
    public navParams: NavParams,
    public salesData:SalesDataProvider,
    public storage:Storage) {
      this.userInfo.vehicleNo=null;
      this.userInfo.invoiceNo=null;
      this.user = new FormGroup({
        vehicleNo: new FormControl({ value: '' }, Validators.compose([Validators.required])),
        mobile: new FormControl({ value: '' }, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])),
        invoice: new FormControl({ value: '' }, Validators.compose([Validators.required])),
        product: new FormControl({ value: '' }, Validators.compose([Validators.required])),
        fuel: new FormControl({ value: '' }, Validators.compose([Validators.required])),
      });
  }

  ionViewDidLoad() {
    this.storage.get('pumpId').then((val) => {
      this.userInfo.pumpId= val;
      this.pumpData.getProducts(this.userInfo.pumpId).subscribe(res=>
        {
          console.log(res.prodrates);
          this.userInfo.ProductList=res.prodrates;
          this.userInfo.productId=res.prodrates[0].productId;
          this.userInfo.productRate=res.prodrates[0].currentRate;
          console.log(this.userInfo.productRate,this.userInfo.productId);
        })
    },err=>{
      console.log(err);
    });
    this.storage.get('username').then((val) => {
      this.userInfo.updatedBy= val;
    });
    this.storage.get('empShiftId').then((val) => {
      this.userInfo.empShiftId= val;
    });
    this.storage.get('employeeId').then((val) => {
      this.userInfo.employeeId= val;
    });
    console.log('ionViewDidLoad OtherSalesPage');
  
  }

  submitSingleSale(){
    if(this.user.valid)
    {console.log('res');
      console.log(this.userInfo)
      this.salesData.saveSingleSale(this.userInfo).subscribe(res=>
        {
          console.log(res);
          var successfull = JSON.stringify(res);
          successfull = JSON.parse(successfull).success;
          console.log(successfull);
          if(successfull!==undefined)
          {
            this.basicData.sendSuccessNotification(successfull);
            this.navCtrl.setRoot(DsmHomePage);
          }
          else{
           // this.basicData.sendErrorNotification(err);
          }
          
        })
    }
    else
    {
      console.log(this.user);
      this.user.controls['vehicleNo'].markAsTouched();
      this.user.controls['mobile'].markAsTouched();
      this.user.controls['invoice'].markAsTouched();
      this.user.controls['product'].markAsTouched();
      this.user.controls['fuel'].markAsTouched();
    }
   
  }
  onChangeAmount(value)
  {
    console.log(value);
    this.userInfo.amount=value*this.userInfo.productRate;
  this.userInfo.amount.toFixed(2);
   this.toFix = this.userInfo.amount;
   this.userInfo.amount = this.toFix.toFixed(2);
   
    // this.dsm.balanceAmount = this.dsm.toFix.toFixed(2);
  }
  
  home() {
    this.navCtrl.setRoot(DsmHomePage);
  }

  selectProductList(value)
  {
    console.log(value);
    this.userInfo.productId=value.productId;
    this.userInfo.productRate=value.currentRate;
    this.userInfo.amount=0;
  }
}
