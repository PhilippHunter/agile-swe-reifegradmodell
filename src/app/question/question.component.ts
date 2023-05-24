import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { SingleQuestion } from '../survey/survey.component';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit, OnChanges {

  @Input() question: SingleQuestion = {} as SingleQuestion;
  @Input() disableBackButton: boolean = true;
  @Output() nextButton = new EventEmitter<number>();
  @Output() previousButton = new EventEmitter<number>();

  public selectedChoice: number;

  constructor() {
    this.selectedChoice = -1;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['question']) {
      this.selectedChoice = changes['question'].currentValue.choice;
    }
  }

  ngOnInit(): void {
    console.log('question', this.question);
  }

  public nextButtonClicked() {
    console.log('next button clicekd');
    this.nextButton.emit(this.selectedChoice);
  }

  public previousButtonClicked() {
    this.previousButton.emit(this.selectedChoice);
  }
}

