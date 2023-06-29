import { Component, Input } from '@angular/core';
import { SingleQuestion } from '../survey/survey.component';

@Component({
  selector: 'app-resultquestion',
  templateUrl: './resultquestion.component.html',
  styleUrls: ['./resultquestion.component.css']
})
export class ResultquestionComponent {

  @Input() question: SingleQuestion = {} as SingleQuestion;
  @Input() selectedChoice: number = -1;
}
