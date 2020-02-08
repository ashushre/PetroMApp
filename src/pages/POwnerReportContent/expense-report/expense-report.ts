import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, App, AlertController, PopoverController } from 'ionic-angular';
import { BasicDataProvider } from '../../../providers/basic-data/basic-data';
import { ReportsProvider } from '../../../providers/reports/reports';
import { DatePipe } from '@angular/common';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the ExpenseReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-expense-report',
  templateUrl: 'expense-report.html',
})
export class ExpenseReportPage {
  pumpId: number;
  startDate: any;
  currentDate: any;
  tDate: any;
  eDate: any;
  sDate: any;
  count: number;
  reportsexpense:any[]=[];
  expenseReport:any[]= [];
  newcategoryList:any[] = [];
  categoryList:any[]= [];

  //FuelSoldList = new Reports;
  shownGroup = null;
  start: Date;
  endDate: any;
  show: boolean = false;
  dateShow: boolean = true;
  datewise: string = 'd';
  categoryShow: boolean = false;
  showRecord: boolean = false;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public popoverCtrl: PopoverController,
    public alert: AlertController,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public datePipe: DatePipe,
    public reportData: ReportsProvider,
    public basicData: BasicDataProvider,
    public appCtrl: App) {
    let backAction = this.platform.registerBackButtonAction(() => {
      this.navCtrl.setRoot("PumpRelatedReportsPage");
      backAction();
    }, 1)
    this.currentDate = new Date().toLocaleDateString();
    // this.currentDate = this.datePipe.transform(this.currentDate, "yyyy-MM-dd");
  }

  ionViewDidLoad() {
    this.storage.get("pumpId").then(val => {
      this.pumpId = val;
      this.endDate = new Date().toISOString();
      var currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - 6);
      this.start = currentDate;
      this.startDate = this.start;
      this.getExpenseReport();
    }, err => {
      console.log(err);
    });
  }

  home() {
    this.navCtrl.setRoot("PumpRelatedReportsPage");
  }

  onChange(value) {
    switch (value) {
      case '1':
        this.startDate = new Date().toISOString();
        this.endDate = new Date().toISOString();
        if (this.datewise == 'd') 
        {
          this.getExpenseReport();
        }
        if(this.datewise=='c')
        {
          this.getCategoryData();
        }
        this.show = false;
        break;

      case '2':
        var currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 1);
        this.start = currentDate;
        this.startDate = this.start.toISOString();
        this.endDate = this.startDate;
        if (this.datewise == 'd') 
        {
          this.getExpenseReport();
        }
        if(this.datewise=='c')
        {
          this.getCategoryData();
        }
        this.show = false;
        break;
      case '3':
        currentDate = new Date();
        this.endDate = new Date().toISOString();
        currentDate.setDate(currentDate.getDate() - 2);
        this.start = currentDate;
        this.startDate = this.start.toISOString();
        if (this.datewise == 'd') 
        {
          this.getExpenseReport();
        }
        if(this.datewise=='c')
        {
          this.getCategoryData();
        }
        this.show = false;
        break;
      case '4':
        currentDate = new Date();
        this.endDate = new Date().toISOString();
        currentDate.setDate(currentDate.getDate() - 6);
        this.start = currentDate;
        this.startDate = this.start.toISOString();
        if (this.datewise == 'd') 
        {
          this.getExpenseReport();
        }
        if(this.datewise=='c')
        {
          this.getCategoryData();
        }
        this.show = false;
        break;
      case '5':
        currentDate = new Date();
        this.endDate = new Date().toISOString();
        currentDate.setDate(currentDate.getDate() - 14);
        this.start = currentDate;
        this.startDate = this.start.toISOString();
        if (this.datewise == 'd') 
        {
          this.getExpenseReport();
        }
        if(this.datewise=='c')
        {
          this.getCategoryData();
        }
        this.show = false;
        break;
      case '6':
        currentDate = new Date();
        this.endDate = new Date().toISOString();
        currentDate.setDate(1);
        this.start = currentDate;
        this.startDate = this.start.toISOString();
        if (this.datewise == 'd') 
        {
          this.getExpenseReport();
        }
        if(this.datewise=='c')
        {
          this.getCategoryData();
        }
        this.show = false;
        break;
      case '7':
        currentDate = new Date();

        currentDate.setDate(1);
        var currentMonth = currentDate.getMonth() - 1;
        currentDate.setMonth(currentMonth);
        this.start = currentDate;
        this.startDate = this.start.toISOString();
        // var currentDate = new Date();
        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        var lastDay = new Date(y, m, 0);
        this.start = lastDay;
        this.endDate = this.start.toISOString();
        if (this.datewise == 'd') 
        {
          this.getExpenseReport();
        }
        if(this.datewise=='c')
        {
          this.getCategoryData();
        }
        break;
      case '8':
        this.show = true;
        break;
    }
  }
  dateChanged(item) {
    if (this.sDate == undefined || this.eDate == undefined) {
    }
    else {
      this.startDate = this.sDate;
      this.endDate = this.eDate;
      if (this.datewise == 'd') 
        {
          this.getExpenseReport();
        }
        if(this.datewise=='c')
        {
          this.getCategoryData();
        }
    }

  }

  getExpenseReport() {
    console.log(this.datewise)
    this.reportsexpense=[];
    let loading = this.loadingCtrl.create({
      content: 'Please wait...', enableBackdropDismiss: true,
    });

    loading.present();
    this.endDate = this.datePipe.transform(this.endDate, "yyyy-MM-dd");
    this.startDate = this.datePipe.transform(this.startDate, "yyyy-MM-dd");
    this.tDate = this.startDate + ',' + this.endDate;//together Date
    this.reportData.getExpense(this.pumpId, this.tDate).subscribe(res => {
      loading.dismiss();
      console.log(res)
     this.reportsexpense=res;
      this.count = 0;
      var k = 0;
      for (var i = 0; i < res.length; i++) {
        this.count += parseFloat(this.reportsexpense[i].sumAmount);
        // for (var j = 0; j < this.expenseReport[i].data.length; j++) {
        //   this.categoryList[k] = this.expenseReport[i].data[j];
        //   k++;
        // }
      }
     // this.categoryData();
      console.log(this.expenseReport);
     
    }, err => {

      this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
      loading.dismiss();
    })
  }

  getCategoryData()
  {
    this.categoryList=[];
    this.newcategoryList=[];
    let loading = this.loadingCtrl.create({
      content: 'Please wait...', enableBackdropDismiss: true,
    });

    loading.present();
    this.endDate = this.datePipe.transform(this.endDate, "yyyy-MM-dd");
    this.startDate = this.datePipe.transform(this.startDate, "yyyy-MM-dd");
    this.tDate = this.startDate + ',' + this.endDate;//together Date
    this.reportData.getExpense(this.pumpId, this.tDate).subscribe(res => {
      loading.dismiss();
      console.log(res)
     this.expenseReport=res;
      this.count = 0;
      var k = 0;
      for (var i = 0; i < res.length; i++) {
        this.count += parseFloat(this.expenseReport[i].sumAmount);
        for (var j = 0; j < this.expenseReport[i].data.length; j++) {
          this.categoryList[k] = this.expenseReport[i].data[j];
          k++;
        }
      }
     // this.categoryData();
      console.log(this.expenseReport);
   
    this.newcategoryList=[];
    let sample=this.categoryList;
    for (var l = 0; l < sample.length; l++) {
      for (var n = l + 1; n< sample.length;) {
        console.log(sample[n].id, sample[l].id)
        if (sample[n].id == sample[l].id) {
         // console.log(sample[n].amount, sample[l].amount)
          sample[l].amount = parseFloat(sample[n].amount) + parseFloat(sample[l].amount);
          for (var m = n; m < sample.length; m++) {
            sample[m] = sample[m + 1];
          }
          sample.length--;
        }
        else {
          n++;
        }
      }
    }


    for(var per=0;per<sample.length;per++){
      sample[per].percentage=(parseFloat(sample[per].amount)/this.count)*100
    }
    console.log(sample)
    this.newcategoryList=sample.sort(function(obj1, obj2) {
      // Ascending: first age less than the previous
      return obj2.amount - obj1.amount;
    });

      console.log(this.categoryList, this.newcategoryList);
  }, err => {

    this.basicData.sendErrorNotification("There is some issue. Please TRY again!!!");
    loading.dismiss();
  })
  
  



  }
  menuClick() {
    this.basicData.checkPumpCount();
  }
  getDetail() {
    console.log('hii');

  }
  toggleGroup(group) {

    if (this.isGroupShown(group)) {
      this.shownGroup = null;
    } else {
      this.shownGroup = group;
    }
  }

  categoryData()
  {
   
  }

  isGroupShown(group) {
    return this.shownGroup === group;
  }

  getCategory() {
    if (this.datewise == 'd') {
      this.dateShow = true;
      this.categoryShow = false;
      this.getExpenseReport();
      console.log(this.reportsexpense);
    }
    if (this.datewise == 'c') {
      this.categoryShow = true;
      this.dateShow = false;
      this.getCategoryData();
    }
    console.log(this.datewise);
  }

}