import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { SingleQuestion } from '../survey/survey.component';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
})
export class QuestionComponent implements OnInit, OnChanges {

  @Input() question: SingleQuestion = {} as SingleQuestion;
  @Input() disableBackButton: boolean = true;
  @Input() weightsEnabled: boolean = false;
  @Output() nextButton = new EventEmitter<number>();
  @Output() previousButton = new EventEmitter<number>();
  @Output() boostButton = new EventEmitter<boolean>();
  @Output() showWeightsModal = new EventEmitter<boolean>();
  @Output() selectionChanged = new EventEmitter<number>();
  @Output() startTourEvent = new EventEmitter<boolean>();
  @Output() resetSurveyEvent = new EventEmitter<boolean>();

  public selectedChoice: number;
  public boosted: boolean;
  public dialItems: MenuItem[] = [
    {
        icon: 'pi pi-forward',
        tooltipOptions: {
          tooltipLabel: 'Direkt zur Auswertung'
        },
        command: () => {
          this.navigateToResult();
        }
    },
    {
        icon: 'pi pi-sliders-h',
        tooltipOptions: {
          tooltipLabel: 'Gewichtungen anpassen'
        },
        command: () => {
          this.showDialog();
        }
    },
    {
        icon: 'pi pi-trash',
        tooltipOptions: {
          tooltipLabel: 'Angaben zurücksetzen'
        },
        command: () => {
          this.resetSurveyEvent.emit(true);
        }
    },
    {
        icon: 'pi pi-question',
        tooltipOptions: {
          tooltipLabel: 'Tutorial'
        },
        command: () => {
          this.startTourEvent.emit(true);
        }
    }
  ];;

  constructor(
    private router: Router,
  ) {
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

  public selectionRadioChanged() {
    // console.log('selection changed!!');
    this.selectionChanged.emit(this.selectedChoice);
  }

  public navigateToResult(){
    this.router.navigate(['/results']);
  }
}

