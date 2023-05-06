import { Component, EventEmitter, Output } from '@angular/core';
import { Category } from '../survey/survey.component';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent {
  events: any[];


  @Output() changedTopic = new EventEmitter<Category>();

  constructor() {
    // maybe change color or icons in further advance
      this.events = [
          { status: 'Prozesse',  color: '#678877', image: 'game-controller.jpg', id: Category.processes },
          { status: 'Organisation',  color: '#678877', image: 'game-controller.jpg', id: Category.organisation },
          { status: 'Technologie', color: '#678877', image: 'game-controller.jpg', id: Category.technology },
          { status: 'Skills & Kultur', color: '#678877', image: 'game-controller.jpg', id: Category.skills_culture },
          { status: 'Strategie', color: '#678877', image: 'game-controller.jpg', id: Category.strategy },
      ];
      }

  public clicked(topic: Category) {
      console.log('clicked topic: ' + topic );
      this.changedTopic.emit(topic);
  }
}
