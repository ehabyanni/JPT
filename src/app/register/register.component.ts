import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  constructor(
    private formbuilder: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  isRegistered: boolean = false;
  isRegisterFailed: boolean = false;
  registrationError: string = '';
  registerForm: any;

  ngOnInit(): void {
    this.registerForm = this.formbuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      address: [''],
      phone_number: ['', [Validators.pattern(/^[0-9]{10}$/)]],
      birthdate: [''],
    });
  }

  get NAME() {
    return this.registerForm.get('name');
  }
  get EMAIL() {
    return this.registerForm.get('email');
  }
  get PASSWORD() {
    return this.registerForm.get('password');
  }
  get ADDRESS() {
    return this.registerForm.get('address');
  }
  get PHONE() {
    return this.registerForm.get('phone_number');
  }
  get BIRTHDATE() {
    return this.registerForm.get('birthdate');
  }

  onSubmit() {
    let username = this.NAME?.value;
    let email = this.EMAIL?.value;
    let password = this.PASSWORD?.value;
    let address = this.ADDRESS?.value;
    let phone_number = this.PHONE?.value;
    let birthdate = this.BIRTHDATE?.value;

    if (this.registerForm.valid) {
      this.auth.Register({
        name: username,
        email: email,
        password: password,
        address: address,
        phone_number: phone_number,
        date_of_birth: birthdate,
      }).subscribe(
        (response) => {
          // Success handler
          console.log(response.message);
          this.isRegistered = true;
          this.registrationError = '';
        },
        (error) => {
          // Error handler
          this.isRegistered = false;
          this.registrationError = error.error.message || 'Registration failed';
          console.error(this.registrationError);
        }
      );
    } else{
      this.isRegistered = false;
      this.registrationError = 'Invalid form';
    }
  }
}
