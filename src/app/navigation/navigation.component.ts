import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  items: MenuItem[] = [];
  public showDialog: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService
    ) {

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
    const url = this.router.url;
    if (url == '/results') {
      console.log('ist auf result page');
      this.showDialog = true;


    } else {
      this.router.navigate(['/home']);
    }
    console.log('url', url);
    console.log('here');
  }

  public confirm() {
    this.confirmationService.confirm({
        message: 'Are you sure that you want to perform this action?',
        accept: () => {
            //Actual logic to perform a confirmation
        }
    });
  }

  public navHome(nav: boolean) {
    if (nav) {
      this.router.navigate(['/home']);
      localStorage.clear();
    } else {
      console.log('no navigation');
    }
    this.showDialog = false;
  }


}
