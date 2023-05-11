import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '../survey/survey.component';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent {
  events: any[];

  @Input() currentCategory: Category = Category.processes;
  @Output() changedTopic = new EventEmitter<Category>();

  constructor() {
    // maybe change color or icons in further advance
      this.events = [
          { status: 'Prozesse',  color: '#3B82F6', image: 'game-controller.jpg', id: Category.processes },
          { status: 'Organisation',  color: '#3B82F6', image: 'game-controller.jpg', id: Category.organisation },
          { status: 'Technologie', color: '#3B82F6', image: 'game-controller.jpg', id: Category.technology },
          { status: 'Skills & Kultur', color: '#3B82F6', image: 'game-controller.jpg', id: Category.skills_culture },
          { status: 'Strategie', color: '#3B82F6', image: 'game-controller.jpg', id: Category.strategy },
      ];
      }

  public clicked(topic: Category) {
      console.log('clicked topic: ' + topic );
      this.changedTopic.emit(topic);
  }
}
