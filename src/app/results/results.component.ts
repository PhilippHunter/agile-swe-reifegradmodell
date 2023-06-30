import { Component, ElementRef, ViewChild } from '@angular/core';
import { ResultService } from '../result-service/result.service';

import {
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexChart,
  ApexXAxis,
  ChartComponent
} from "ng-apexcharts";
import { Category, DimensionWeight, Questions, SingleQuestion } from '../survey/survey.component';
import { Button } from 'primeng/button';

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
  @ViewChild("chart") chart = {} as ChartComponent;
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

  public selectedOption: string = "all"


  constructor(
    private resultService: ResultService
  ) {
    this.getWeights();
    this.getQuestions();
    this.createChart();
    this.sortQuestions();
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
    const seriesdata = [];
    const categories = [];
    for (const category of Object.keys(this.allQuestions)) {
      const catQuestions: SingleQuestion[] = Object(this.allQuestions)[category];
      if (category != "default") {

        const anwseredQuestions = catQuestions.filter(a => a.choice != -1);
        console.log('length', anwseredQuestions.length);
        let sum = 0;
        if (anwseredQuestions.length > 0) {
          for (const anwser of anwseredQuestions) {
            sum += anwser.choice;
          }
        }
        console.log('sum', sum);
        const max = anwseredQuestions.length*4
        console.log('max', max);
        const percent = sum/max*100;
        console.log('percent', percent);
        const title = this.getTitleFromCategory(category);
        if (percent) {
          seriesdata.push(percent);
          categories.push(title);
        }
      }
    }


    this.chartOptions = {
      series: [
        {
          name: "Ergebnis",
          // data: [80, 50, 30, 40, 100]
          data: seriesdata
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
        // categories: ["Prozesse", "Organisation", "Technologie", "Skills & Kultur", "Strategie"]
        categories: categories
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
    }
    return this.allQuestions;
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

  public viewchanged() {
    console.log('anzeige', this.selectedOption);
    this.showAll = false;
    this.showHigh = false;
    this.showMedium = false;
    this.showLow = false;
    this.showUnanwsered = false;
    if (this.selectedOption == 'all') {
      this.showAll = true;
    } else if (this.selectedOption == 'high') {
      this.showHigh = true;
    } else if (this.selectedOption == 'medium') {
      this.showMedium = true;
    } else if (this.selectedOption == 'low') {
      this.showLow = true;
    } else if (this.selectedOption == 'unanswered') {
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
