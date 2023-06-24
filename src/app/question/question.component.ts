import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { SingleQuestion } from '../survey/survey.component';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit, OnChanges {

  @Input() question: SingleQuestion = {} as SingleQuestion;
  @Input() disableBackButton: boolean = true;
  @Input() weightsEnabled: boolean = false;
  @Output() nextButton = new EventEmitter<number>();
  @Output() previousButton = new EventEmitter<number>();
  @Output() boostButton = new EventEmitter<boolean>();
  @Output() showWeightsModal = new EventEmitter<boolean>();

  public selectedChoice: number;
  public boosted: boolean;

  constructor() {
    this.selectedChoice = -1;
    this.boosted = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // listen for changes on question Input (when new question is loaded) and display selection
    if (changes['question']) {
      this.selectedChoice = changes['question'].currentValue.choice;
      this.boosted = changes['question'].currentValue.boosted;
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

  public boostClicked() {
    this.boostButton.emit(this.boosted);
  }

  public showDialog() {
    // Output to Survey Component for showing weights modal
    this.showWeightsModal.emit(true);
  }
}

