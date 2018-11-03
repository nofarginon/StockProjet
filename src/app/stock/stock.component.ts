import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { timer } from 'rxjs';
import { StockServiceService } from '../stock-service.service';
import { AmChartsService, AmChart } from "@amcharts/amcharts3-angular";

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {
  dataFromRequestSymbol: any={};
  dataFromRequestStock:any={};
  //symbols:string[]=[];
  symbols:string[]=["SPY", "DIAX", "NDAQ", "AMZN", "GOOG"];
  data : string[]=["S&P 500","Dow 30","Nasdaq","Amazon","Alphabet"];
  stocks:any[5]=[];
  stock:any={};
  loading:boolean =true;
  LastRefreshed:string;
  timeArray:any[5]=[];
  interval:number=0;
  stocksChart:any[5]=[];
  isCreated:boolean=false;
  public optionsSPY: any;
  public optionsDIAX: any;
  public optionsNDAQ: any;
  public optionsAMZN: any;
  public optionsGOOG: any;
  constructor(private StockServiceService: StockServiceService,private AmCharts: AmChartsService) { }

  ngOnInit() {
    for(let i=0;i<5;i++){
      this.stock.name=this.data[i];
      this.stock.symbol=this.symbols[i];
      this.stocks.push(this.stock);
      this.stock={};
    }

    this.startInterval();
  }
  startInterval(){
   Observable
    .timer(100, 5*60*1000)
    .timeInterval()
    .flatMap(() => this.StockServiceService.getDataFromFiveResources(this.symbols))
    .subscribe(responseList => {
      this.dataFromRequestStock=responseList;
      console.log(this.dataFromRequestStock);
      this.LastRefreshed=this.dataFromRequestStock[0]["Meta Data"]["3. Last Refreshed"];
      for(let j=0;j<5;j++){
        let currentStock=this.dataFromRequestStock[j];
        this.timeArray[j]=this.convertToArray(currentStock);
        let obj=this.timeArray[j][1];
        let secondKey=Object.keys(obj)[1];
        let lastClose=currentStock["Time Series (5min)"][secondKey];
        let finddata=currentStock["Time Series (5min)"][currentStock["Meta Data"]["3. Last Refreshed"]];
        this.stocks[j].close =finddata["4. close"];
        this.stocks[j].open =finddata["1. open"];
        if(this.stocks[j].close>lastClose["4. close"]){this.stocks[j].trend=1;}
        else if(this.stocks[j].close<lastClose["4. close"]){this.stocks[j].trend=-1;}
        else{this.stocks[j].trend=0;}
        if(!this.isCreated){
          this.stocksChart[j]=this.createChart(currentStock);
          switch (this.symbols[j]) {
            case "SPY":
                 this.optionsSPY =this.makeOptions(this.stocksChart[0]) ;
                 break;
             case "DIAX":
                 this.optionsDIAX =this.makeOptions(this.stocksChart[1]) ;
                 break;
             case "NDAQ":
                 this.optionsNDAQ =this.makeOptions(this.stocksChart[2]) ;
                 break;
             case "AMZN":
                 this.optionsAMZN =this.makeOptions(this.stocksChart[3]) ;
                 break;
            case "GOOG":
                this.optionsGOOG =this.makeOptions(this.stocksChart[4]) ;
                break;
           }
        }
        else{
          let today=new Date().getDay();
          let hour =this.convertHour(this.LastRefreshed);
          let hourTemp=hour.split(":");
          let hourInteger=hourTemp.join("");
          if((today !== 6 && today !== 0)&&(parseInt(hourInteger) > 160000)){
            console.log("Loading Update");
            this.stocksChart[j].shift();
            this.stocksChart[j]=this.updateChart(currentStock,this.stocksChart[j]);
            console.log("after update");
            console.log(this.stocksChart[j]);
            switch (this.symbols[j]) {
              case "SPY":
                   this.optionsSPY =this.makeOptions(this.stocksChart[0]) ;
                   break;
               case "DIAX":
                   this.optionsDIAX =this.makeOptions(this.stocksChart[1]) ;
                   break;
               case "NDAQ":
                   this.optionsNDAQ =this.makeOptions(this.stocksChart[2]) ;
                   break;
               case "AMZN":
                   this.optionsAMZN =this.makeOptions(this.stocksChart[3]) ;
                   break;
              case "GOOG":
                  this.optionsGOOG =this.makeOptions(this.stocksChart[4]) ;
                  break;
             }
          }
        }
    }
    this.isCreated=true;
    this.loading=false;
  });
}

  makeOptions(dataProvider) {
 return {
   "type": "stock",
   "theme": "light",
   "categoryAxesSettings": {
     "minPeriod": "mm"
   },

   "dataSets": [ {
     "color": "#d37d96",
     "fieldMappings": [ {
       "fromField": "value",
       "toField": "value"
     }, {
       "fromField": "volume",
       "toField": "volume"
     } ],

     "dataProvider": dataProvider,
     "categoryField": "date"
   } ],

   "panels": [ {
     "showCategoryAxis": false,
     "title": "Value",
     "percentHeight": 70,

     "stockGraphs": [ {
       "id": "g1",
       "valueField": "value",
       "type": "smoothedLine",
       "lineThickness": 2,
       "bullet": "round"
     } ],


     "stockLegend": {
       "valueTextRegular": " ",
       "markerType": "none"
     }
   }, {
     "title": "Volume",
     "percentHeight": 30,
     "stockGraphs": [ {
       "valueField": "volume",
       "type": "column",
       "cornerRadiusTop": 2,
       "fillAlphas": 1
     } ],

     "stockLegend": {
       "valueTextRegular": " ",
       "markerType": "none"
     }
   } ],

   "chartScrollbarSettings": {
     "graph": "g1",
     "usePeriod": "10mm",
     "position": "top"
   },

   "chartCursorSettings": {
     "valueBalloonsEnabled": true
   },

   "periodSelector": {
     "position": "top",
     "dateFormat": "YYYY-MM-DD JJ:NN",
     "inputFieldWidth": 150,
     "periods": [ {
       "period": "hh",
       "count": 1,
       "label": "1 hour"
     }, {
       "period": "hh",
       "count": 2,
       "label": "2 hours"
     }, {
       "period": "hh",
       "count": 5,
       "selected": true,
       "label": "5 hour"
     }, {
       "period": "hh",
       "count": 12,
       "label": "12 hours"
     }, {
       "period": "MAX",
       "label": "MAX"
     } ]
   },

   "panelsSettings": {
     "usePrefixes": true
   },

   "export": {
     "enabled": true,
     "position": "bottom-right"
   }
 }
}


  createChart(currentStock):any[]{
    let objectsStock=[];

    let datesArray=Object.getOwnPropertyNames(currentStock["Time Series (5min)"]);
    for(let k=72;k>=0;k--){
      var objectS={date:"date" , value:"value", volume:"volume"};
      objectS.date=datesArray[k];
      objectS.value=currentStock["Time Series (5min)"][datesArray[k]]["4. close"];
      objectS.volume=currentStock["Time Series (5min)"][datesArray[k]]["5. volume"];

      objectsStock.push(objectS);
    }
    return objectsStock;

  }

  updateChart(currentStock,stocksChartdem):string[]{
    let objectNew={date:"date",value:"value",volume:"volume"};
    let datesArray=Object.getOwnPropertyNames(currentStock["Time Series (5min)"]);
    objectNew.date=datesArray[0];
    objectNew.value=currentStock["Time Series (5min)"][datesArray[0]["4. close"]];
    objectNew.volume=currentStock["Time Series (5min)"][datesArray[0]["5. volume"]];
    stocksChartdem.push(objectNew);
    return stocksChartdem;
  }

  convertToArray(temp){
    var resultArray = Object.keys(temp).map(function(tempIndex){
        let time = temp[tempIndex];
        return time;
    });
    return resultArray;
  }

  convertHour(date){
    let splitDate=date.split(" ");
    let hour =splitDate[1];
    return hour;

  }

  convertDay(date){
    let splitDate=date.split(" ");
    let day =splitDate[0];
    return day;
  }

}
