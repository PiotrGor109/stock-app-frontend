import {Injectable} from '@angular/core';
import {CompanyIndex} from "../model/companyIndex";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, map, Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

  private baseUrl = 'http://localhost:8080/companyIndexes';
  private listOfDataChart = [];

  companyIndex: CompanyIndex[] = [];



  constructor(private httpClient: HttpClient) {
  }






  //PAGINATION
  private response_: any;

  getCompanyIndexesListPaginate(thePage: number,
                                thePageSize: number): Observable<GetResponseCompanyIndex> {
    // need to build URL based on category id, page and size
    const searchUrl = `${this.baseUrl}?`
      + `page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseCompanyIndex>(searchUrl);
  }


  //GET ALL INDEXES
  getCompanyIndexesList(): Observable<CompanyIndex[]> {
    const searchUrl = `${this.baseUrl}`;
    return this.httpClient.get<GetResponseCompanyIndex>(searchUrl).pipe(
      map(response => response._embedded.companyIndexes)
    );


  }

  //SEARCH INDEXES
  searchCompanyIndex(theKeyword: string): Observable<CompanyIndex[]> {
    const searchUrl = `${this.baseUrl}/search/findByCompanyNameContaining?company_name=${theKeyword}`;
    console.log(searchUrl)
    return this.httpClient.get<GetResponseCompanyIndex>(searchUrl).pipe(
      map(response => response._embedded.companyIndexes)
    );
  }


  //SEARCH INDEXES
  getDataToChart(id: string): Observable<string> {
    const searchUrl = `http://localhost:8080/company-indexes/details/${id}`;
    console.log(searchUrl)
    return this.httpClient.get<string>(searchUrl);
  }













}







interface GetResponseCompanyIndex {
  _embedded: {
    companyIndexes: CompanyIndex[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}
