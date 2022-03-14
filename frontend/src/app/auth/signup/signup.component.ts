import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  pwdInputType: string = 'password';
  pwd: string;
  cnf: string;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  onShowPwds(event: any) {
    this.pwdInputType = event.checked ? 'text' : 'password';
  }

  onSignup(form: NgForm) {
    if (form.invalid) return;
    const { email, password, confirmPassword } = form.value;
    this.authService.signup(email, password, confirmPassword);
    // form.resetForm();
  }
}
