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
      new Expert(
        "Javier Gutierrez",
        "Agile Coach bei BRANDAD Development GmbH",
        "../../assets/images/BRANDAD_Development.svg",
        "https://brandad.dev/"
        ),
      new Expert(
        "Kevin Edelmann",
        "Scrum Master bei CodeCamp:N",
        "../../assets/images/codecamp_n_logo.svg",
        "https://www.codecamp-n.com/"
      ),
      new Expert(
        "Siemens",
        "Scrum Master bei Siemens",
        "../../assets/images/siemens-logo-default.svg",
        "https://www.siemens.com/de/de.html"
      )
    ];
  }
}

class Expert {
  name: string = "";
  description: string = "";
  company_image: string = "";
  company_link: string = "";

  constructor(name: string, description: string, company_image: string, company_link: string) {
    this.name = name;
    this.description = description;
    this.company_image = company_image;
    this.company_link = company_link;
  }
}

