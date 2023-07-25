import { ActivatedRoute, Route, Router } from '@angular/router';
import { Component, inject, Input, OnInit } from '@angular/core';
import * as questions from '../../assets/questions.json';
import { ResultService } from '../result-service/result.service';
import { IStepOption, TourAnchorMatMenuDirective, TourMatMenuModule, TourService } from 'ngx-ui-tour-md-menu';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {

  private unawnseredQuestionsSurvey: boolean = false;
  private allQuestions: Questions;
  public allCategoryQuestion: SingleQuestion[] = [];
  public currentCategory: Category = Category.processes;
  public indexQuestion: number = 0;
  public indexCategory: number = 0;
  private categoryOrder = [Category.processes, Category.organisation, Category.technology, Category.skills_culture, Category.strategy]

  public weightsEnabled: boolean = false;
  public enableWeightsVisible: boolean = false;
  public weightsVisible: boolean = false;
  public dimensionWeights: DimensionWeight = {
    [Category.processes]: 1,
    [Category.organisation]: 1,
    [Category.technology]: 1,
    [Category.skills_culture]: 1,
    [Category.strategy]: 1,
  };


  constructor(
    private router: Router,
    private resultService: ResultService,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe((params) => {
      const unansweredsurvey = params.get('unansweredsurvey');
      console.log('unansweredsurvey', unansweredsurvey);
      if (unansweredsurvey) {
        this.unawnseredQuestionsSurvey = Boolean(unansweredsurvey)
      }
    })
    this.allQuestions = questions as Questions;
    console.log('allquestions', this.allQuestions);
    this.allCategoryQuestion = this.allQuestions[this.currentCategory];
    console.log('allcategory', this.allCategoryQuestion);
  }

  readonly tourSteps: IStepOption[] = [{
    anchorId: 'start.tour',
    route: 'navigation/survey',
    content: 'Willkommen zur Fragebogen-Tour!',
    title: 'Willkommen',
    enableBackdrop: false
  }, {
    anchorId: 'question.progressbar',
    route: 'navigation/survey',
    content: `Hier siehst du deinen aktuellen Fortschritt im Fragebogen.<br>
    Über einen Klick auf eine Fragegruppe kannst du schnell zu dieser navigieren.<br>
    Der ausgefüllte Punkt zeigt die aktuelle Fragegruppe an.`,
    title: 'Fortschrittsanzeige'
  }, {
    anchorId: 'question.title',
    route: 'navigation/survey',
    content: 'Hier ist die aktuelle Frage, die zu beantworten ist.',
    title: 'Frage - Titel'
  }, {
    anchorId: 'question.answers',
    route: 'navigation/survey',
    content: `Dies sind die möglichen Antworten zu der gegebenen Frage.<br>
    Hier wählst du für jede Frage die eine passende Antwort.<br>
    Je weiter unten deine Antwort ist, desto höher ist dein Score. Bleib aber dabei ehrlich ;)`,
    title: 'Frage - Antworten'
  }, {
    anchorId: 'question.button.prev',
    route: 'navigation/survey',
    content: 'Damit gelangst du zur vorherigen Frage.',
    title: 'Frage - Zurück'
  }, {
    anchorId: 'question.button.weights',
    route: 'navigation/survey',
    content: 'Hier öffnest du ein Fenster, in dem du deine Schwerpunkte individuell festlegen kannst.',
    title: 'Frage - Gewichte'
  }, {
    anchorId: 'question.button.next',
    route: 'navigation/survey',
    content: 'Damit gelangst du zur nächsten Frage.',
    title: 'Frage - Weiter'
  }, {
    anchorId: 'question.button.toresult',
    route: 'navigation/survey',
    content: 'Damit gelangst du direkt zu deinem Ergebnis.',
    title: 'Frage - Ergebnis'
  }, {
    anchorId: 'results.overview',
    route: 'navigation/results',
    content: 'Nachdem du alle Fragen beantwortet hast, findest du hier dein Ergebnis.',
    title: 'Ergebnis - Überblick',
    enableBackdrop: false,
  }, {
    anchorId: 'results.pdf',
    route: 'navigation/results',
    content: 'Dein Ergebnis kannst du ganz bequem als PDF exportieren.',
    title: 'Ergebnis - PDF Export'
  }, {
    anchorId: 'results.scores',
    route: 'navigation/results',
    content: 'Hier kannst du deinen Gesamtscore, deine erreichten Teil-Prozente und Gewichtungen in den jeweiligen Kategorien sehen.',
    title: 'Ergebnis - Scores'
  }, {
    anchorId: 'results.chart',
    route: 'navigation/results',
    content: 'Hier kannst du deine Ergebnisse in einem schönen Netzgraphen begutachten.',
    title: 'Ergebnis - Chart',
    backdropConfig: {
      offset: 0
    }
  }, {
    anchorId: 'results.answers',
    route: 'navigation/results',
    content: `Hier hast du eine weitere Übersicht zu deinen beantworteten Fragen.<br>
    Du kannst hierbei zwischen den Kategorien wechseln und einen Score-Filter einstellen.`,
    title: 'Ergebnis - Antworten',
    backdropConfig: {
      offset: 100
    }
  }, {
    anchorId: 'start.tour',
    route: 'navigation/survey',
    content: 'Das war die kleine UI Tour. Wir hoffen, dass du dich nun zurecht findest.',
    title: 'Tour-Ende',
    enableBackdrop: false
  }];
  public readonly tourService = inject(TourService);

  ngOnInit(): void {
    console.log('survey init');
    // load if weights were enabled earlier
    let ls_weightsEnabled = localStorage.getItem('weightsEnabled');
    if (ls_weightsEnabled !== null)
      this.weightsEnabled = !!JSON.parse(ls_weightsEnabled);
    else
      this.enableWeightsVisible = true;

    let ls_allQuestions;
    if (this.unawnseredQuestionsSurvey) {
      ls_allQuestions = localStorage.getItem('unawnseredQuestions');
    } else {
      // load former question status
      ls_allQuestions = localStorage.getItem('allQuestions');
    }
    if (ls_allQuestions !== null) {
      console.log('questions loaded from ls');
      this.allQuestions = JSON.parse(ls_allQuestions);
      this.allCategoryQuestion = this.allQuestions[this.currentCategory];
    }

    // load formerly saved weights
    let ls_dimensionWeights = localStorage.getItem('dimensionWeights');
    if (ls_dimensionWeights !== null) {
      console.log('weights loaded from ls');
      this.dimensionWeights = JSON.parse(ls_dimensionWeights);
    }

    // init UI tour
    this.tourService.initialize(this.tourSteps, {
      delayBeforeStepShow: 20,
      prevBtnTitle: 'Zurück',
      nextBtnTitle: 'Weiter',
      endBtnTitle: 'Ende',
      stepDimensions: {
        minWidth: '300px',
        maxWidth: '400px'
      },
      enableBackdrop: true,
      backdropConfig: {
        offset: 10
      }
    });
  }


  public nextButtonClicked(choice: number) {
    this.persistChoice(choice);

    if (this.indexQuestion < this.allCategoryQuestion.length - 1) {
      this.indexQuestion++;
    } else if (this.indexQuestion == this.allCategoryQuestion.length - 1) {
      this.nextCategory();
      this.indexQuestion = 0;
    }
  }

  private nextCategory() {
    if (this.indexCategory < this.categoryOrder.length - 1) {
      this.indexCategory++;
      this.currentCategory = this.categoryOrder[this.indexCategory];
      this.allCategoryQuestion = this.allQuestions[this.currentCategory];
      console.log('current categroy', this.currentCategory);
      if(this.unawnseredQuestionsSurvey) {
        if (this.allCategoryQuestion.length == 0) {
          console.log('Länge ist 0');
          this.nextCategory();
        }
      }
    } else if (this.indexCategory == this.categoryOrder.length - 1) {
      // could navigate to result
      console.log('navigate to result');
      this.resultService.generateFeedback(this.allQuestions);
      this.router.navigate(['navigation/results']);
    }
  }

  public previousButtonClicked(choice: number) {
    this.persistChoice(choice);

    if (this.indexQuestion == 0) {
      this.previousCategory();
      console.log('indexquestion', this.indexQuestion);
      console.log('index category', this.indexCategory);
      // if (this.indexCategory != 0 && this.indexQuestion != 0) {
      this.indexQuestion = this.allCategoryQuestion.length - 1;
      // }
    } else {
      console.log('indes minus');
      console.log('indexquestion', this.indexQuestion);
      console.log('index category', this.indexCategory);
      this.indexQuestion--;
    }
  }

  public boostButtonClicked(value: boolean) {
    this.allCategoryQuestion[this.indexQuestion].boosted = value;
  }

  private previousCategory() {
    if (this.indexCategory == 0) {
      // disable button or so
      console.log('disable button');
    } else {
      this.indexCategory--;
      this.currentCategory = this.categoryOrder[this.indexCategory];
      this.allCategoryQuestion = this.allQuestions[this.currentCategory];
      console.log('current categroy', this.currentCategory);
    }
  }

  public changedTopic(event: Category) {
    console.log('event in survey', event);
    this.currentCategory = event;
    this.indexCategory = this.categoryOrder.findIndex(a => a == event);
    this.indexQuestion = 0;
    this.allCategoryQuestion = this.allQuestions[this.currentCategory];
  }

  public persistChoice(choice: number) {
    this.allCategoryQuestion[this.indexQuestion].choice = choice;
    this.persistToSession();
  }

  private persistToSession() {
    if(this.unawnseredQuestionsSurvey) {
      // unawnseredQuestions
      localStorage.setItem('unawnseredQuestions', JSON.stringify(this.allQuestions));
    } else {
      localStorage.setItem('allQuestions', JSON.stringify(this.allQuestions));
    }
  }

  protected toggleWeights(value: boolean) {
    // toggle state + local storage
    console.log('toggling weights... ' + value);
    this.weightsEnabled = value;
    localStorage.setItem('weightsEnabled', JSON.stringify(value));

    // set visibility for modals
    if (value == true)
      this.weightsVisible = value;
    this.enableWeightsVisible = false;
  }

  protected saveWeights() {
    console.log('saving weights');
    localStorage.setItem('dimensionWeights', JSON.stringify(this.dimensionWeights));
    this.weightsVisible = false;
  }
}


export type Questions = {
  processes: SingleQuestion[],
  organisation: SingleQuestion[],
  technology: SingleQuestion[],
  skills_culture: SingleQuestion[],
  strategy: SingleQuestion[]
}

export type SingleQuestion = {
  title: string,
  cite: string,
  answers: Answer[],
  choice: number,
  boosted: boolean,
  shortTitle: string
}

export type Answer = {
  score: number,
  text: string
}

export enum Category {
  processes = 'processes',
  organisation = 'organisation',
  technology = 'technology',
  skills_culture = 'skills_culture',
  strategy = 'strategy'
}

export type DimensionWeight = {
  [Category.processes]: number,
  [Category.organisation]: number,
  [Category.technology]: number,
  [Category.skills_culture]: number,
  [Category.strategy]: number,
};
