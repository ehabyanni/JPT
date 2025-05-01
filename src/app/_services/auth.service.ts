import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { delay, Observable, of, throwError } from 'rxjs';
import { IRegister } from '../_interfaces/IRegister';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  public Register(email: string, password: string): Observable<any> {
    let usersRegistered = JSON.parse(
      localStorage.getItem('usersRegistered') || '[]'
    );

    // Check if user already exists
    const userExists = usersRegistered.find(
      (user: IRegister) => user.email === email
    );

    if (userExists) {
      return throwError(() => ({
        error: { message: 'User already registered with this email.' },
      }));
    }

    // Register new user
    const newUser = { email, password };
    usersRegistered.push(newUser);
    localStorage.setItem('usersRegistered', JSON.stringify(usersRegistered));

    return of({
      message: 'Registration successful.',
      user: { email },
    }).pipe(delay(1000));
  }

  public login(email: string, password: string): Observable<any> {
    const usersRegistered = JSON.parse(
      localStorage.getItem('usersRegistered') || '[]'
    );

    const matchedUser = usersRegistered.find(
      (user: { email: string; password: string }) =>
        user.email === email && user.password === password
    );

    if (matchedUser) {
      return of({
        message: 'Login successful',
        user: { email },
      }).pipe(delay(1000));
    } else {
      return throwError(() => ({
        error: { message: 'Invalid email or password' },
      })).pipe(delay(1000));
    }
  }

  // //check Authentication
  // public isLoggedIn(): Observable<any> {
  //   let isAuth: boolean = false;
  //   const token = localStorage.getItem('authToken');
  //   if (token != null || undefined) {
  //     isAuth = true;
  //   }
  //   return of(isAuth);
  // }

  // public logout() {
  //   localStorage.clear();
  //   this.router.navigate(['login']);
  // }
}
