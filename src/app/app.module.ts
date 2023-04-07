import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ButtonModule } from 'primeng/button';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { QuestionComponent } from './question/question.component';
import { SurveyComponent } from './survey/survey.component';
import { ResultsComponent } from './results/results.component';
import { NavigationComponent } from './navigation/navigation.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    QuestionComponent,
    SurveyComponent,
    ResultsComponent,
    NavigationComponent
  ],
  imports: [
    BrowserModule,
    ButtonModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
