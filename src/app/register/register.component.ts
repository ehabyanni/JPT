import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { IUser } from '../_interfaces/IUser';
import { Register } from '../store/auth/auth.state';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  constructor(
    private formbuilder: FormBuilder,
    // private auth: AuthService,
    private router: Router,
    private store: Store,
    private toastr: ToastrService
  ) {}

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

  onSubmit(userData: IUser) {
    this.store.dispatch(new Register(userData)).subscribe({
      next: () => {
        this.toastr.success('Registration successful.');
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.toastr.error(err.message);
      },
    });
  }
}
