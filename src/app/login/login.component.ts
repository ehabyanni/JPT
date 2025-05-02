import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  isLoggedIn: boolean = false;
  isLoginFailed: boolean = false;
  errorMessage: string = '';
  loginForm: any;
  
  constructor(
    private formbuilder: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}


  ngOnInit(): void {
    this.loginForm = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  //email property
  get EMAIL() {
    return this.loginForm.get('email');
  }

  //password property
  get PASSWORD() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    let email = this.EMAIL?.value;
    let password = this.PASSWORD?.value;

    if (this.loginForm.valid) {
      this.auth.login(email, password).subscribe(
        (response) => {
          console.log(response.message);
          this.isLoggedIn = true;
          this.errorMessage = '';
          // this.router.navigate(['/home']); // or any route you want
        },
        (error) => {
          this.isLoggedIn = false;
          this.errorMessage = error.error.message || 'Login failed';
        }
      );
    }
  }
}
