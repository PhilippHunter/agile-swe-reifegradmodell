import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent {
  experts: Expert[] = [];
  responsiveOptions: any[] = [];

  constructor(private router: Router) {

  }

  navigateSurvey() {
    this.router.navigate(['/navigation/survey']);
  }

  ngOnInit() {
    this.experts = [
      new Expert("Expert1", "Description1", "Link1"),
      new Expert("Expert2", "Description2", "Link2"),
      new Expert("Expert3", "Description3", "Link3"),
      new Expert("Expert4", "Description4", "Link4"),
      new Expert("Expert5", "Description5", "Link5"),
      new Expert("Expert6", "Description6", "Link6"),
    ];
    this.responsiveOptions = [
      {
        breakpoint: '1400px',
        numVisible: 3,
        numScroll: 1
      },
      {
        breakpoint: '1220px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '1100px',
        numVisible: 1,
        numScroll: 1
      }
    ];
  }
}

class Expert {
  title: string = "";
  description: string = "";
  link: string = "";

  constructor(title: string, description: string, link: string) {
    this.title = title;
    this.description = description;
    this.link = link;
  }
}

