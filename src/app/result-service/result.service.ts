import { Injectable } from '@angular/core';
import { Questions } from '../survey/survey.component';

@Injectable({
  providedIn: 'root'
})
export class ResultService {
  public feedback_Processes = "";
  public feedback_Organisation = "";
  public feedback_Technology = "";
  public feedback_Skills_culture = "";
  public feedback_Strategy = "";


  constructor() { }

  public generateFeedback(questions: Questions) {
    // generate feedback giving the anwser of the user
    // do some stuff with the generate Feedback

    this.feedback_Processes = "kommt noch..."
    this.feedback_Organisation = "kommt noch..."
    this.feedback_Technology = "kommt noch..."
    this.feedback_Skills_culture = "kommt noch..."
    this.feedback_Strategy = "kommt noch..."

  }
}
