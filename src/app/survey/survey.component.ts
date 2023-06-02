import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as questions from '../../assets/questions.json';
import { ResultService } from '../result-service/result.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent {

  private allQuestions: Questions;
  public allCategoryQuestion: SingleQuestion[] = [];
  public currentCategory: Category = Category.processes;
  public indexQuestion: number = 0;
  public indexCategory: number = 0;
  private categoryOrder = [Category.processes, Category.organisation, Category.technology, Category.skills_culture, Category.strategy]


  constructor(
    private router: Router,
    private resultService: ResultService
  ) {
    this.allQuestions = questions as Questions;
    console.log('allquestions', this.allQuestions);
    this.allCategoryQuestion = this.allQuestions[this.currentCategory];
    console.log('allcategory', this.allCategoryQuestion);
  }

  public nextButtonClicked() {
    // console.log('in survery nex');
    if (this.indexQuestion < this.allCategoryQuestion.length - 1) {
      this.indexQuestion++;
    } else if (this.indexQuestion == this.allCategoryQuestion.length - 1) {
      this.nextCategory();
      this.indexQuestion = 0;
    }
  }

  private nextCategory() {
    if (this.indexCategory < this.categoryOrder.length - 1) {
      this.indexCategory++;
      this.currentCategory = this.categoryOrder[this.indexCategory];
      this.allCategoryQuestion = this.allQuestions[this.currentCategory];
      console.log('current categroy', this.currentCategory);
    } else if (this.indexCategory == this.categoryOrder.length -1) {
      // could navigate to result
      console.log('navigate to result');
      this.resultService.generateFeedback(this.allQuestions);
      this.router.navigate(['navigation/results']);
    }
  }

  public previousButtonClicked() {
    // console.log('previous buttonclicked');
    if (this.indexQuestion == 0) {
      this.previousCategory();
      console.log('indexquestion', this.indexQuestion);
      console.log('index category', this.indexCategory);
      // if (this.indexCategory != 0 && this.indexQuestion != 0) {
        this.indexQuestion = this.allCategoryQuestion.length - 1;
      // }
    } else {
      console.log('indes minus');
      console.log('indexquestion', this.indexQuestion);
      console.log('index category', this.indexCategory);
      this.indexQuestion--;
    }
  }

  private previousCategory() {
    if (this.indexCategory == 0) {
      // disable button or so
      console.log('disable button');
    } else {
      this.indexCategory--;
      this.currentCategory = this.categoryOrder[this.indexCategory];
      this.allCategoryQuestion = this.allQuestions[this.currentCategory];
      console.log('current categroy', this.currentCategory);
    }
  }

  public changedTopic(event: Category){
    console.log('event in survey', event);
    this.currentCategory = event;
    this.indexCategory = this.categoryOrder.findIndex(a => a == event);
    this.indexQuestion = 0;
    this.allCategoryQuestion = this.allQuestions[this.currentCategory];
  }

}


export type Questions = {
  processes: SingleQuestion[],
  organisation: SingleQuestion[],
  technology: SingleQuestion[],
  skills_culture: SingleQuestion[],
  strategy: SingleQuestion[]
}

export type SingleQuestion = {
  title: string,
  cite: string,
  answers: Anwsers[],
}

type Anwsers = {
  score: number,
  text: string
}

export enum Category {
  processes = 'processes',
  organisation = 'organisation',
  technology = 'technology',
  skills_culture = 'skills_culture',
  strategy = 'strategy'
}
