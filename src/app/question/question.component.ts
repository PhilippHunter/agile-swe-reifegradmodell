import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  categories: any[] = [
    
    { name: 'Accounting', key: 'A' },
    
    { name: 'Marketing', key: 'M' },
    
    { name: 'Production', key: 'P' },
    
    { name: 'Research', key: 'R' }
    
  ];
  
  selectedCategory: any = null;

  ngOnInit(): void {

  }
}
