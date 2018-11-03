import { Injectable } from '@angular/core';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx'

@Injectable({
  providedIn: 'root'
})
export class StockServiceService {
  private api_urlSymbol: string = 'https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=';
  private api_urlDaily: string = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=';
  private apiKey: string ='13SJVHO30RN9HO88';
  private apiKeyDemo: string ='TUEB67PO4DFQEBFY';
  private apiKeyS: string ='IHQY42J0IN1K1J3M';

  constructor(private http: Http) {}

  getSymbolsFromFiveResources(data) {
      let url1 = this.http.get(this.api_urlSymbol + encodeURIComponent(data[0]) + '&apikey=' + this.apiKeyDemo).map((res) => res.json())
      .catch((error : any) => Observable.throw('Server error'));
      let url2 = this.http.get(this.api_urlSymbol + encodeURIComponent(data[1]) + '&apikey=' + this.apiKeyDemo).map((res) => res.json())
      .catch((error : any) => Observable.throw('Server error'));
      let url3 = this.http.get(this.api_urlSymbol + encodeURIComponent(data[2]) + '&apikey=' + this.apiKeyDemo).map((res) => res.json())
      .catch((error : any) => Observable.throw('Server error'));
      let url4 = this.http.get(this.api_urlSymbol + encodeURIComponent(data[3]) + '&apikey=' + this.apiKeyDemo).map((res) => res.json())
      .catch((error : any) => Observable.throw('Server error'));
      let url5 = this.http.get(this.api_urlSymbol + encodeURIComponent(data[4]) + '&apikey=' + this.apiKeyDemo).map((res) => res.json())
      .catch((error : any) => Observable.throw('Server error'));

      return Observable.forkJoin([url1, url2 , url3 , url4 , url5]);
    }

    getDataFromFiveResources(data) {
      let url1 = this.http.get(this.api_urlDaily + encodeURIComponent(data[0]) + '&interval=5min&apikey=' + this.apiKeyS).map((res) => res.json())
      .catch((error : any) => Observable.throw('Server error'));
      let url2 = this.http.get(this.api_urlDaily + encodeURIComponent(data[1]) + '&interval=5min&apikey=' + this.apiKeyS).map((res) => res.json())
      .catch((error : any) => Observable.throw('Server error'));
      let url3 = this.http.get(this.api_urlDaily + encodeURIComponent(data[2]) + '&interval=5min&apikey=' + this.apiKeyS).map((res) => res.json())
      .catch((error : any) => Observable.throw('Server error'));
      let url4 = this.http.get(this.api_urlDaily + encodeURIComponent(data[3]) + '&interval=5min&apikey=' + this.apiKeyS).map((res) => res.json())
      .catch((error : any) => Observable.throw('Server error'));
      let url5 = this.http.get(this.api_urlDaily + encodeURIComponent(data[4]) + '&interval=5min&apikey=' + this.apiKeyS).map((res) => res.json())
      .catch((error : any) => Observable.throw('Server error'));

      return Observable.forkJoin([url1, url2 , url3 , url4 , url5]);
    }

}
