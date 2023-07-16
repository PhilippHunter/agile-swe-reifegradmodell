import { Component, ElementRef, ViewChild } from '@angular/core';
import { ResultService } from '../result-service/result.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import html2canvas from 'html2canvas';

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
  public dimensionScores: DimensionWeight = {} as DimensionWeight;
  public allQuestions: Questions = {} as Questions;
  public sortedQuestions: SortedQuestion[] = [];
  private catTitleArray = [
    { category: Category.processes, title: 'Prozesse' },
    { category: Category.organisation, title: 'Organisation' },
    { category: Category.skills_culture, title: 'Skills & Kultur' },
    { category: Category.strategy, title: 'Strategie' },
    { category: Category.technology, title: 'Technologie' },
  ];
  public showAll: boolean = true;
  public showHigh: boolean = false;
  public showMedium: boolean = false;
  public showLow: boolean = false;
  public showUnanswered: boolean = false;
  public finalScore: number = 0;
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
    let sumWeights = 0;
    let sumAllWithWeights = 0
    for (const category of Object.keys(this.allQuestions)) {
      const catQuestions: SingleQuestion[] = Object(this.allQuestions)[category];
      if (category != "default") {
        const answeredQuestions = catQuestions.filter(a => a.choice != -1);
        console.log('length', answeredQuestions.length);
        let sum = 0;
        let max = 0;
        if (answeredQuestions.length > 0) {
          for (const answer of answeredQuestions) {
            sum += answer.boosted ? 2 * answer.choice : answer.choice;
            max += answer.boosted ? 2 * 4 : 4;
          }
        }
        console.log('sum', sum);
        console.log('max', max);
        let percent = sum / max * 100;
        console.log('percent', percent);
        const title = this.getTitleFromCategory(category);

        if (percent) {
          // finalscore berechnen
          sumWeights += Object(this.dimensionWeights)[category];
          sumAllWithWeights += percent * Object(this.dimensionWeights)[category];
        } else {
          percent = 0;
        }
        seriesdata.push(percent);
        categories.push(title);
        Object(this.dimensionScores)[category] = percent;

      }
    }
    console.log('dimensionScores', this.dimensionScores);
    this.finalScore = sumAllWithWeights / sumWeights;
    console.log('finalScore', this.finalScore);


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
        type: "radar",
        toolbar: { show: false }
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
    let weightsEnabled; 
    let ls_weightsEnabled = localStorage.getItem('weightsEnabled');
    if (ls_weightsEnabled !== null)
      weightsEnabled = !!JSON.parse(ls_weightsEnabled);
    const value = localStorage.getItem('dimensionWeights');
    if (weightsEnabled && value) {
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
    this.showUnanswered = false;
    if (this.selectedOption == 'all') {
      this.showAll = true;
    } else if (this.selectedOption == 'high') {
      this.showHigh = true;
    } else if (this.selectedOption == 'medium') {
      this.showMedium = true;
    } else if (this.selectedOption == 'low') {
      this.showLow = true;
    } else if (this.selectedOption == 'unanswered') {
      this.showUnanswered = true;
    }
  }

  public async exportPDF() {
    const documentDefinition: any = {
      info: {
        title: 'HowAgile_AgilerGrad_fertigerFragebogen',
        author: 'HowAgile'
      },
      images: {
        checkedImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALMAAACzCAMAAAD1yt3BAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAA/UExURQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALMlgi8AAAAUdFJOUwAIEBggMEiAj5+nt7/Hz9ff5+/3VKGkDAAAAAlwSFlzAAAywAAAMsABKGRa2wAAAplJREFUeF7t2ttum0AUhWE7cdI0btO08fs/a5t6u5DY2Pu4ZlOt/wY0I5jvAiGNYHNYXzRjohkTzZhO5s0aehXr8UBzVTRjohkTzZhoxkQzJpox0YyJZkw0Y6IZE82YaMZEMyaaMdGMiWZMXc0PT3Jyoabmh1+Hr3J6Xk/zH/JhGd3S/Je8jO5oFvIiuqH5H3k95pvkfubb5HZmBbmbWUNuZlaRe5l3P4VxldzKvBPMDXIns5bcyKwm9zHryW3MBnIXs4XcxGwi9zDbyC3MRnIHs5XcwGwmjzfbycPNDvJos4c82OwijzX7yEPNE/lZRnQNNE/k/VaGdI0zu8njzH7yMHOAPMp8HyAPMt+9yHoe8hhzjDzEHCSPMEfJA8xhMt4cJ8PNCWS0OYMMNqeQseYcst4cWURKIqvN271pK3GpLLLWvN0b9z/npZGV5ndyEJ1H1pmP5BA6kawzP8usH51J1pl1n+2ulEpWPs9BdC5ZaY6hJ/L3DLLWHEFP5Jc7GYqlNfvR6WS92YvOJxvMM/QXGVF0erUnki1mD7qCbDLb0SVkm9mKriEbzTZ0EdlqtqCryGazHl1Gtpu16Dqyw6xDF5I9Zg26kuwy30aXkn3mW+hastN8HV1M9po3j29yxTm6muw2L6PLyX7zErqeHDBfRgPIEfMlNIIcMp+jIeSY+TMaQw6aP6In8uu9zJcUNM/RM/JOZmuKmmdouVU5OW6eoaVqcoL5M7qcnGH+iK4np5jnaAA5xzyhEeQk8wkNIWeZj2gMOc38jgaR88ybxx8gcqIZF82YaMZEMyaaMdGMiWZMNGOiGRPNmGjGRDMmmjHRjIlmTDRjohkTzZhoxkQzJpox/Qfmb2tIfrw4mdcUzZhoxrQ+8+HwGwSdxyzca33eAAAAAElFTkSuQmCC',
        uncheckedImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALMAAACzCAMAAAD1yt3BAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAPUExURQAAAAAAAAAAAAAAAAAAAE8O540AAAAEdFJOUwC/3/dY6GHYAAAACXBIWXMAADLAAAAywAEoZFrbAAAA4klEQVR4Xu3OKw6AUBDAQD7v/mdGAAZPk02mpna2NS/mJuYm5qbXvE3oeKz3mP+KuYm5ibmJuYm5ibmJuYm5ibmJuYm5ibmJuYm5ibmJuYm5ibmJuYm5ibmJuYm5ibmJuYm5ibmJuYm5ibmJuYm5ibmJuYm5ibmJuYm5ibmJuYm5ibmJuYm5ibmJuYm5ibmJuYm5ibmJuYm5ibmJuYm5ibmJuYm5ibmJuYm5ibmJuYm5ibmJuYm5ibmJuYm5ibmJuYm5ibmJuYm5ibmJuYm5ibnpY94ndN7W1zwp5ibmpnnmtS51SkgH+mt04wAAAABJRU5ErkJggg=='
      },
      styles: {
        overallTitle: {
          fontSize: 24,
          bold: true,
          alignment: 'center'
        },
        categoryTitle: {
          fontSize: 20,
          bold: true,
          color: '#0037A7'
        },
        questionTitle: {
          fontSize: 12,
          color: '#048ADF'
        },
        answerText: {
          fontSize: 10
        }
      },
      footer: function (currentPage: any, pageCount: any) {
        return {
          text: currentPage.toString() + ' von ' + pageCount,
          fontSize: 8,
          alignment: 'center'
        }
      },
      content: []
    };

    // Get logo
    const logoElement = document.getElementById('home-link');
    if (logoElement instanceof Element) {
      // Create canvas for logo element
      const canvas = await html2canvas(logoElement, { scale: 2 });

      // Convert the canvas to a base64-encoded PNG image
      const logoImage = canvas.toDataURL('image/png');

      // Add the logo image to the document
      documentDefinition.content.push({ image: logoImage, width: 100 });
      documentDefinition.content.push('\n');
    }

    const titleElement = [
      {
        text: 'Reifegrad Ihrer agilen Softwareentwicklung - Ergebnisse',
        style: 'overallTitle'
      }
    ];
    documentDefinition.content.push(titleElement);

    // Select the chart div
    const chartElement = document.getElementById('chart');

    if (chartElement instanceof Element) {
      // Convert the chart element to a canvas using html2canvas
      const canvas = await html2canvas(chartElement, { scale: 2 });

      // Convert the canvas to a base64-encoded PNG image
      const chartImage = canvas.toDataURL('image/png');

      // Add the chart image to the document
      documentDefinition.content.push({ image: chartImage, style: { alignment: 'center' }, fit: [500, 500] });
    }

    // Create table
    const tableElement = [
      {
        layout: 'lightHorizontalLines',
        table: {
          headerRows: 1,
          widths: ['*', '*', '*'],

          body: [
            [{ text: 'Kategorie', bold: true }, { text: 'Gewichtung', bold: true }, { text: 'Erzielter Wert', bold: true }],
            ['Prozesse', this.dimensionWeights.processes.toFixed(2) + "x", this.dimensionScores.processes.toFixed(2) + "%"],
            ['Strategie', this.dimensionWeights.strategy.toFixed(2) + "x", this.dimensionScores.strategy.toFixed(2) + "%"],
            ['Skills & Kultur', this.dimensionWeights.skills_culture.toFixed(2) + "x", this.dimensionScores.skills_culture.toFixed(2) + "%"],
            ['Technologie', this.dimensionWeights.technology.toFixed(2) + "x", this.dimensionScores.technology.toFixed(2) + "%"],
            ['Organisation', this.dimensionWeights.organisation.toFixed(2) + "x", this.dimensionScores.organisation.toFixed(2) + "%"],
          ]
        }
      }
    ];

    documentDefinition.content.push(tableElement);
    documentDefinition.content.push('\n');

    // Create text for overall score
    const overallScoreElement = [
      {
        alignment: 'right',
        text: "Gesamtscore: " + this.finalScore.toFixed(2) + "%",
        bold: true
      }
    ]
    documentDefinition.content.push(overallScoreElement);
    documentDefinition.content.push({ text: '', pageBreak: 'after' });

    // Iterate over each category in sortedQuestions
    for (let categoryIndex = 0; categoryIndex < this.sortedQuestions.length; categoryIndex++) {
      const category = this.sortedQuestions[categoryIndex];

      // Add category title to the document
      documentDefinition.content.push({ text: category.title, style: 'categoryTitle' });

      // Iterate over the 'high', 'medium', 'low', and 'unanswered' question arrays
      for (const key of ['high', 'medium', 'low', 'unanswered'] as Array<keyof SortedQuestion>) {
        if (category[key].length > 0) {
          // Add subcategory title to the document
          let keyTrans: string = key;
          if (key === 'high') {
            keyTrans = 'Gut';
            documentDefinition.content.push({ text: keyTrans, color: 'green', bold: true, italics: true, fontSize: 16 });

          }
          if (key === 'medium') {
            keyTrans = 'Mittel';
            documentDefinition.content.push({ text: keyTrans, color: 'orange', bold: true, italics: true, fontSize: 16 });

          }
          if (key === 'low') {
            keyTrans = 'Schlecht';
            documentDefinition.content.push({ text: keyTrans, color: 'red', bold: true, italics: true, fontSize: 16 });

          }
          if (key === 'unanswered') {
            keyTrans = 'Unbeantwortet';
            documentDefinition.content.push({ text: keyTrans, color: 'gray', bold: true, italics: true, fontSize: 16 });

          }

          // Iterate over the questions in the current subcategory
          for (const question of category[key] as SingleQuestion[]) {
            // Add question title, citation, and choice to the document
            documentDefinition.content.push({ text: question.title, style: 'questionTitle' });

            // Create radio button list for each question
            const radioButtons = [];
            for (let i = 0; i < question.answers.length; i++) {
              const answer = question.answers[i];
              const radioText = { text: answer.text, style: 'answerText' };
              const radioButton = {
                table: {
                  widths: ['auto', '*'],
                  body: [
                    [{ image: question.choice === i ? documentDefinition.images.checkedImage : documentDefinition.images.uncheckedImage, width: 10 }, radioText]
                  ]
                },
                layout: 'noBorders'
              };
              radioButtons.push(radioButton);
            }

            // Add radio button list to the document
            documentDefinition.content.push({ stack: radioButtons });

            // Add a line break after each question
            documentDefinition.content.push('\n');
          }
        }
      }

      // Add a page break between categories, except for the last category
      if (categoryIndex < this.sortedQuestions.length - 1) {
        documentDefinition.content.push({ text: '\n', pageBreak: 'after' });
      }
    }

    // Generate and open the PDF
    pdfMake.createPdf(documentDefinition).open();
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
