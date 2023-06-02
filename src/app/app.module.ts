import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CardModule } from 'primeng/card';
import { CarouselModule} from 'primeng/carousel';
import { DividerModule } from 'primeng/divider';

import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { QuestionComponent } from './question/question.component';
import { SurveyComponent } from './survey/survey.component';
import { ResultsComponent } from './results/results.component';
import { NavigationComponent } from './navigation/navigation.component';
import { AboutComponent } from './about/about.component';
import { ProgressComponent } from './progress/progress.component';
import { TimelineModule } from 'primeng/timeline';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    QuestionComponent,
    SurveyComponent,
    ResultsComponent,
    NavigationComponent,
    AboutComponent,
    ProgressComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ButtonModule,
    MenubarModule,
    RadioButtonModule,
    CardModule,
    CarouselModule,
    DividerModule,
    InputTextModule,
    AppRoutingModule,
    TimelineModule,
    NgApexchartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
