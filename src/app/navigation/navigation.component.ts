import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  items: MenuItem[] = [];

  constructor(private router: Router) {

  }

  ngOnInit(): void {
    this.items = [
      {
        icon: '',
        label: 'Survey',
        routerLink: 'survey'
      }
    ]
  }

  navigateHome() {
    console.log('here');
    this.router.navigate(['/home']);
  }

}
