import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { StockIndexComponent } from './components/stock-index/stock-index.component';
import {HttpClientModule} from "@angular/common/http";
import {RouterModule, Routes} from "@angular/router";
import {HttpServiceService} from "./services/httpService.service";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchComponent } from './components/search/search.component';
import {ReactiveFormsModule} from "@angular/forms";
import { DetailsComponent } from './components/details/details.component';





const routes: Routes = [
  {path: 'company-indexes', component : StockIndexComponent},
  {path: 'search/:searchWord', component: StockIndexComponent},
  {path: 'details/:id', component: DetailsComponent},
  {path: '', redirectTo: '/company-indexes', pathMatch: 'full'},
  {path: '**', redirectTo: '/company-indexes', pathMatch: 'full'}
];




@NgModule({
  declarations: [
    AppComponent,
    StockIndexComponent,
    SearchComponent,
    DetailsComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
  ],
  providers: [HttpServiceService, StockIndexComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
