import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SurveyComponent } from './survey/survey.component';
import { ResultsComponent } from './results/results.component';
import { NavigationComponent } from './navigation/navigation.component';


const routes: Routes = [
  { path: '', redirectTo: 'navigation', pathMatch: 'full' },
  { path: 'navigation', component: NavigationComponent, children: [
    { path: 'home', component: HomeComponent },
    { path: 'survey', component: SurveyComponent },
    { path: 'results', component: ResultsComponent },
  ] },
];

@NgModule({
  declarations: [],
  imports: [
    // CommonModule
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {

}
