import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SurveyComponent } from './survey/survey.component';
import { ResultsComponent } from './results/results.component';
import { NavigationComponent } from './navigation/navigation.component';
import { AboutComponent } from './about/about.component';


const routes: Routes = [
  { path: '', redirectTo: 'navigation', pathMatch: 'full' },
  { path: 'navigation', component: NavigationComponent, children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent, data: { title: 'Home'} },
    { path: 'survey/:unansweredsurvey', component: SurveyComponent, data: { title: 'Fragebogen' } },
    { path: 'results', component: ResultsComponent, data: { title: 'Ergebnis' } },
    { path: 'about', component: AboutComponent, data: { title: 'About Us' } },
  ] },
];

@NgModule({
  declarations: [],
  imports: [
    // CommonModule
    RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'}),
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {

}
