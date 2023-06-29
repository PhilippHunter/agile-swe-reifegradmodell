import { Component, ViewChild } from '@angular/core';
import { ResultService } from '../result-service/result.service';

import {
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexChart,
  ApexXAxis,
  ChartComponent
} from "ng-apexcharts";
import { Category, DimensionWeight, Questions, SingleQuestion } from '../survey/survey.component';

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
  public allQuestions: Questions = {} as Questions;
  public sortedQuestions: SortedQuestion[] = [];
  private catTitleArray = [
    {category: Category.processes, title: 'Prozesse'},
    {category: Category.organisation, title: 'Organisation'},
    {category: Category.skills_culture, title: 'Skills & Kultur'},
    {category: Category.strategy, title: 'Strategie'},
    {category: Category.technology, title: 'Technologie'},
  ];
  public showAll: boolean = true;
  public showHigh: boolean = false;
  public showMedium: boolean = false;
  public showLow: boolean = false;
  public showUnanwsered: boolean = false;



  constructor(
    private resultService: ResultService
  ) {
    this.getWeights();
    this.createChart();
    this.getQuestions();
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

  private getQuestions() {
    const value = localStorage.getItem('allQuestions');
    if (value) {
      this.allQuestions = JSON.parse(value);
      console.log('allQuestions', this.allQuestions);
      this.sortQuestions();
    }
  }

  private sortQuestions() {
    for (const category of Object.keys(this.allQuestions)) {
      console.log('cat', category);
      // this.allQuestions[Category.organisation]
      const catQuestions: SingleQuestion[] = Object(this.allQuestions)[category]

      console.log('catQuestions', catQuestions);
      if (category != "default") {
        const title = this.getTitleFromCategory(category)
        const sorted: SortedQuestion = {
          category: category,
          title: title,
          high: catQuestions.filter(a => a.choice > 3),
          medium: catQuestions.filter(a => a.choice > 1 && a.choice < 4),
          low: catQuestions.filter(a => a.choice < 2 && a.choice != -1),
          unanswered: catQuestions.filter(a => a.choice == -1)
        }
        console.log('sorted', sorted);
        this.sortedQuestions.push(sorted)
      }
      console.log('sortedQuestions', this.sortedQuestions);

    }
  }

  private getTitleFromCategory(cat: string) {
    const idx = this.catTitleArray.findIndex(a => a.category == cat);
    console.log('idx', idx);
    return this.catTitleArray[idx].title;
  }

  public filterCategories(btn: 'all' | 'high' | 'medium' | 'low' | 'unanwsered' ) {
    if (btn == 'all') {
      this.showAll = true;
      this.showHigh = false;
      this.showMedium = false;
      this.showLow = false;
      this.showUnanwsered = false;
    } else if (btn == 'high') {
      this.showAll = false;
      this.showHigh = true;
    } else if (btn == 'medium') {
      this.showAll = false;
      this.showMedium = true;
    } else if (btn == 'low') {
      this.showAll = false;
      this.showLow = true;
    } else if (btn == 'unanwsered') {
      this.showAll = false;
      this.showUnanwsered = true;
    }
  }

}

type SortedQuestion = {
  category: string,
  high: SingleQuestion[],
  medium: SingleQuestion[],
  low: SingleQuestion[],
  unanswered: SingleQuestion[],
  title: string
}
