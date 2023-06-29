import { Component, ViewChild } from '@angular/core';
import { ResultService } from '../result-service/result.service';

import {
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexChart,
  ApexXAxis,
  ChartComponent
} from "ng-apexcharts";
import { Category, DimensionWeight } from '../survey/survey.component';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  title: ApexTitleSubtitle;
  xaxis: ApexXAxis;
};

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent {
  @ViewChild("chart") chart = {} as ChartComponent ;
  public chartOptions: Partial<ChartOptions> | any;
  public dimensionWeights: DimensionWeight = {} as DimensionWeight;


  constructor(
    private resultService: ResultService
  ) {
    this.getWeights();
    this.createChart();
  }

  public getOrganisationResult() {
    return this.resultService.feedback_Organisation;
  }

  public getProcessesResult() {
    return this.resultService.feedback_Processes;
  }

  public getSkillCultureResult() {
    return this.resultService.feedback_Skills_culture;
  }

  public getStrategyResult() {
    return this.resultService.feedback_Strategy;
  }

  public getTechnologyResult() {
    return this.resultService.feedback_Technology;
  }

  private createChart() {
    this.chartOptions = {
      series: [
        {
          name: "Series 1",
          data: [80, 50, 30, 40, 100]
        }
      ],
      chart: {
        height: 500,
        type: "radar"
      },
      // title: {
      //   text: "Basic Radar Chart"
      // },
      xaxis: {
        categories: ["Prozesse", "Organisation", "Technologie", "Skills & Kultur", "Strategie"]
      }
    };
  }

  private getWeights() {
    const value = localStorage.getItem('dimensionWeights');
    if (value) {
      this.dimensionWeights = JSON.parse(value);
    } else {
      this.dimensionWeights =
      {
        [Category.processes]: 1,
        [Category.organisation]: 1,
        [Category.technology]: 1,
        [Category.skills_culture]: 1,
        [Category.strategy]: 1,
      };
    }
  }

}
