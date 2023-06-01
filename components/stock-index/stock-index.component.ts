import {Component, Input, OnInit} from '@angular/core';
import {CompanyIndex} from "../../model/companyIndex";

import {HttpServiceService} from "../../services/httpService.service";
import {HttpErrorResponse} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-stock-index',
  templateUrl: './stock-index.component.html',
  styleUrls: ['./stock-index.component.css']
})
export class StockIndexComponent implements OnInit {


  companyIndex: CompanyIndex[] = [];

  searchMode: boolean = false;
  previousKeyword: string = "";
  theKeyword: string = "";
  isEmptySearch: string = '';

  // new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;


  constructor(private httpService: HttpServiceService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    //this.checkModelListCompanies();
    this.route.paramMap.subscribe(() => {
      this.checkModelListCompanies();
    });
  }


  //CHECK MODE METHOD
  checkModelListCompanies() {
    this.searchMode = this.route.snapshot.paramMap.has('searchWord');
    console.log("SEARCH MODE: " + this.searchMode);


    if (this.searchMode) {
      this.handleSearchCompanies();
    } else {
      this.getCompanyIndexes();
    }
  }


  //GET ALL INDEXES METHOD
  getCompanyIndexes(): void {
    console.log("GET ALL COMPANY STOCK INDEXES")
    this.httpService.getCompanyIndexesListPaginate(this.thePageNumber - 1,
      this.thePageSize)
      .subscribe(this.processResult());

  }


  //SEARCH INDEXES BY PHRASE METHOD
  handleSearchCompanies() {
    console.log("SEARCH MODE ON - GET ONLY LOOKED FOR STOCK INDEXES")
    this.theKeyword = this.route.snapshot.paramMap.get('searchWord')!;

    if ((this.theKeyword != this.previousKeyword) && this.theKeyword != '') {
      this.httpService.searchCompanyIndex(this.theKeyword).subscribe(
        (response) => {
          this.companyIndex = response;
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        });
    } else {
      this.getCompanyIndexes();
    }
  }


//PAGINATION METHODS
  processResult() {
    return (data: any) => {
      this.companyIndex = data._embedded.companyIndexes;
      this.httpService.companyIndex = this.companyIndex;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.checkModelListCompanies();
  }


  doDetails(value: string) {
    console.log(`value=${value}`);
    this.router.navigateByUrl(`/details/${value}`);
  }
}
