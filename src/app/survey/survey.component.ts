import { Component, Input, OnInit } from '@angular/core';
import * as questions from '../../assets/questions.json';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {

  private allQuestions: Questions;
  public allCategoryQuestion: SingleQuestion[] = [];
  public currentCategory: Category = Category.processes;
  public indexQuestion: number = 0;
  public indexCategory: number = 0;
  private categoryOrder = [Category.processes, Category.organisation, Category.technology, Category.skills_culture, Category.strategy]
  
  public weightsEnabled: boolean = false;
  public enableWeightsVisible: boolean = false;
  public weightsVisible: boolean = false;
  public multiplicatorValues = {
    [Category.processes]: 1,
    [Category.organisation]: 1,
    [Category.technology]: 1,
    [Category.skills_culture]: 1,
    [Category.strategy]: 1,
  };


  constructor() {
    this.allQuestions = questions as Questions;
    console.log('allquestions', this.allQuestions);
    this.allCategoryQuestion = this.allQuestions[this.currentCategory];
    console.log('allcategory', this.allCategoryQuestion);
  }
  ngOnInit(): void {
    console.log('survey init');
    let ls_weightsEnabled = localStorage.getItem('weightsEnabled');
    if (ls_weightsEnabled !== null)
      this.weightsEnabled = !!JSON.parse(ls_weightsEnabled);
    else
      this.enableWeightsVisible = true;

    let ls_allQuestions = localStorage.getItem('allQuestions');
    if (ls_allQuestions !== null) {
      console.log('questions loaded from ls');
      this.allQuestions = JSON.parse(ls_allQuestions);
    }
  }

  public nextButtonClicked(choice: number) {
    this.persistChoice(choice);
    this.persistToSession();

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
    }
  }

  public previousButtonClicked(choice: number) {
    this.persistChoice(choice)
    this.persistToSession();

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

  public boostButtonClicked(value: boolean) {
    this.allCategoryQuestion[this.indexQuestion].boosted = value;
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

  private persistChoice(choice: number) {
    this.allCategoryQuestion[this.indexQuestion].choice = choice;
  }

  private persistToSession() {
    localStorage.setItem('allQuestions', JSON.stringify(this.allQuestions));
  }

  protected toggleWeights(value: boolean) {
    // toggle state + local storage
    console.log('toggling weights... ' + value);
    this.weightsEnabled = value;
    localStorage.setItem('weightsEnabled', JSON.stringify(value));
    
    // set visibility for modals
    if (value == true)
      this.weightsVisible = value;
    this.enableWeightsVisible = false;
  }
}


type Questions = {
  processes: SingleQuestion[],
  organisation: SingleQuestion[],
  technology: SingleQuestion[],
  skills_culture: SingleQuestion[],
  strategy: SingleQuestion[]
}

export type SingleQuestion = {
  title: string,
  cite: string,
  answers: Answer[],
  choice: number,
  boosted: boolean
}

export type Answer = {
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
