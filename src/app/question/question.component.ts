import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as questions from '../../assets/questions.json';
import { SingleQuestion } from '../survey/survey.component';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  @Input() question: SingleQuestion = {} as SingleQuestion;
  @Output() nextButton = new EventEmitter<boolean>();
  @Output() previousButton = new EventEmitter<boolean>();

  categories: any[] = [

    { name: 'Es findet kaum Austausch im Entwicklerteam statt (jeder Arbeitet für sich an seinen Aufgaben)', key: '0' },

    { name: 'Das gesamte Entwicklerteam hat die Möglichkeit sich untereinander abzustimmen', key: '1' },

    { name: 'Es gibt einen festgelegten Rahmen zur regelmäßigen Besprechung (bsp. wöchentlich)', key: '2' },

    { name: 'Es finden jeden Tag zu festgelegter Uhrzeit im kompletten Team Dailys statt. ', key: '3' },

    { name: 'Es finden jeden Tag zu festgelegter Uhrzeit im  Team Dailys statt. Es wird auf eine kurze Dauer und Effektivität geachtet.', key: '4' }

  ];

  selectedCategory: any = null;

  constructor() {
  }

  ngOnInit(): void {
    console.log('question', this.question);
  }

  public nextButtonClicked() {
    console.log('next button clicekd');
    this.nextButton.emit(true);
  }

  public previousButtonClicked() {
    this.previousButton.emit(true);
  }
}

