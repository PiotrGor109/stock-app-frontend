import {Component, Input, OnInit} from '@angular/core';
import {HttpServiceService} from "../../services/httpService.service";
import {HttpErrorResponse} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {Chart} from 'chart.js';
import {registerables} from 'chart.js';
import {StockIndexComponent} from "../stock-index/stock-index.component";
import {CompanyIndex} from "../../model/companyIndex";

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {


  companyIndexDetails: CompanyIndex[] = [];
  listOfDataChart: string[] = [];
  idCompany: string = '';
  public chart: any;
  splittedlistOfDataChart: string[] = [];
  listOfDataChartDates: string[] = [];
  listOfDataChartIndexValues: string[] = [];
  numberValue: number = 0;


  actualCourse: number = 0;
  courseSevenDays: number = 0;
  courseOneMonth: number = 0;
  courseThreeMonths: number = 0;

  courseSevenDaysValue: number = 0;
  courseOneMonthValue: number = 0;
  courseThreeMonthsValue: number = 0;


  constructor(private httpService: HttpServiceService, private route: ActivatedRoute, private stockIndexComponent: StockIndexComponent) {
  }

  ngOnInit(): void {
    this.companyIndexDetails = this.httpService.companyIndex;
    if (this.companyIndexDetails.length == 0) {
      this.getCompanyData();
    }

    this.getDataToChart();
  }


  //GET ALL DATA TO CHART
  getDataToChart(): string[] {
    console.log("COMPONENT DETAILS")
    this.idCompany = this.route.snapshot.paramMap.get('id')!;
    this.httpService.getDataToChart(this.idCompany).subscribe(
      (response) => {
        this.listOfDataChart.push(response)
        this.splittedlistOfDataChart = this.listOfDataChart[0].toString().split(",")
        this.numberValue = Number(this.idCompany);
        this.prepareChartValues();
        this.createChart()
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
    console.log("GET DATA method: " + this.listOfDataChart.length);
    return this.listOfDataChart;

  }


  createChart() {
    console.log("CREATE CHART method: " + this.listOfDataChart.length);

    Chart.register(...registerables);
    var myChart = new Chart("myChart", {
      type: 'line',
      data: {
        labels: Object.values(this.listOfDataChartDates.reverse()),
        datasets: [{
          label: 'Company stock Index',
          data: Object.values(this.listOfDataChartIndexValues.reverse()),
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }


  prepareChartValues() {
    for (let i = 0; i < this.splittedlistOfDataChart.length; i++) {
      if (i % 2 == 0) {
        this.listOfDataChartDates.push(this.splittedlistOfDataChart[i])
      } else {
        this.listOfDataChartIndexValues.push(this.splittedlistOfDataChart[i])
      }
    }

    this.courseSevenDaysValue = Number(this.listOfDataChartIndexValues.at(6));
    this.courseOneMonthValue = Number(this.listOfDataChartIndexValues.at(30));
    this.courseThreeMonthsValue = Number(this.listOfDataChartIndexValues.at(90));


    this.actualCourse = Number(this.listOfDataChartIndexValues.at(0))!;
    this.courseSevenDays = Math.round(Math.abs(Number(this.listOfDataChartIndexValues.at(6))! - this.actualCourse) / (Number(this.listOfDataChartIndexValues.at(6))!) * 100);
    this.courseOneMonth = Math.round(Math.abs(Number(this.listOfDataChartIndexValues.at(30))! - this.actualCourse) / (Number(this.listOfDataChartIndexValues.at(30))!) * 100);
    this.courseThreeMonths = Math.round(Math.abs(Number(this.listOfDataChartIndexValues.at(90))! - this.actualCourse) / (Number(this.listOfDataChartIndexValues.at(90))!) * 100);
  }


  getCompanyData() {
    this.httpService.getCompanyIndexesList().subscribe(
      (response) => {
        this.companyIndexDetails = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

}
