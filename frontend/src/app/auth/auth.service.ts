import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BehaviorSubject } from 'rxjs';

import { environment } from './../../environments/environment';
import { appConstant } from '../constants/app.constants';
import { SignupData, LoginData, UserData } from './auth-data.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string;
  private userId: string;
  private tokenTimer: NodeJS.Timer;
  private authStatusListener = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: HotToastService
  ) {}

  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  signup(email: string, password: string, confirmPassword: string) {
    const data: SignupData = { email, password, confirmPassword };
    this.http
      .post<{ status: string; message: string; data: UserData }>(
        `${environment.rootUrl}${appConstant.USER_API}/signup`,
        data
      )
      .pipe(
        this.toast.observe({
          loading: 'Signing up...',
          success: (res) => `Signed up successfully! ${res.message}`,
          error: (err) => `${err}`,
        })
      )
      .subscribe((res) => {
        this.token = res.data.token;
        if (this.token) {
          this.userId = res.data.userId;
          this.setTokenTimer(res.data.expiresIn);
          const now = new Date();
          const expiration = new Date(
            now.getTime() + res.data.expiresIn * 1000
          );
          this.saveAuthData(this.token, expiration, this.userId);
          this.authStatusListener.next(true);
          this.router.navigate(['/']);
        }
      });
  }

  login(email: string, password: string) {
    const data: LoginData = { email, password };
    this.http
      .post<{ status: string; message: string; data: UserData }>(
        `${environment.rootUrl}${appConstant.USER_API}/login`,
        data
      )
      .pipe(
        this.toast.observe({
          loading: 'Logging in...',
          success: (res) => `${res.message}`,
          error: (err) => `${err}`,
        })
      )
      .subscribe((res) => {
        this.token = res.data.token;
        if (this.token) {
          this.userId = res.data.userId;
          this.setTokenTimer(res.data.expiresIn);
          const now = new Date();
          const expiration = new Date(
            now.getTime() + res.data.expiresIn * 1000
          );
          this.saveAuthData(this.token, expiration, this.userId);
          this.authStatusListener.next(true);
          this.router.navigate(['/']);
        }
      });
  }

  autoLogin() {
    const authData = this.getAuthData();
    if (!authData) return;
    const now = new Date();
    const expiresIn = authData.expiration.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authData.token;
      this.userId = authData.userId;
      this.setTokenTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    } else {
      this.logout();
    }
  }

  logout() {
    this.toast.loading('Logging out...', { duration: 2000 });
    setTimeout(() => {
      this.token = null;
      this.userId = null;
      if (this.tokenTimer) clearTimeout(this.tokenTimer);
      this.authStatusListener.next(false);
      this.clearAuthData();
      this.toast.success('Logged out successfully');
      this.router.navigate(['/']);
    }, 2000);
  }

  private setTokenTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expiration: Date, userId: string) {
    localStorage.setItem('userId', userId);
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expiration.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expiration) return;
    return { token, expiration: new Date(expiration), userId };
  }
}
