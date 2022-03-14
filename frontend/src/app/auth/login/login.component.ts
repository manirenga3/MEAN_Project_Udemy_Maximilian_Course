import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  pwdInputType: string = 'password';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  onShowPwd(event: any) {
    this.pwdInputType = event.checked ? 'text' : 'password';
  }

  onLogin(form: NgForm) {
    if (form.invalid) return;
    const { email, password } = form.value;
    this.authService.login(email, password);
    // form.resetForm();
  }
}
