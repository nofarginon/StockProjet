import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AmChartsModule } from "@amcharts/amcharts3-angular";

import { AppComponent } from './app.component';
import { StockComponent } from './stock/stock.component';
import { StockServiceService } from './stock-service.service';

@NgModule({
  declarations: [
    AppComponent,
    StockComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AmChartsModule
  ],
  providers: [StockServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
