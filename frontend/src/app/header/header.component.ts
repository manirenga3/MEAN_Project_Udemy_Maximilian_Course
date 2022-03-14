import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  private authSub$: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authSub$ = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isAuthenticated = authStatus;
      });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    if (this.authSub$) this.authSub$.unsubscribe();
  }
}
