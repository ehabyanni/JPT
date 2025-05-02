import { Injectable } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';
import { IUser } from '../_interfaces/IUser';
import { Store } from '@ngxs/store';
import { Login, Logout, Register } from '../store/auth/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private store: Store) {}

  public Register(userData: IUser): Observable<any> {
    this.store.dispatch(new Register(userData));
    return new Observable((observer) => {
      observer.next({
        message: 'Registration successful.',
        user: userData,
      });
      observer.complete();
    });
  }

  // Login user
  public login(email: string, password: string): Observable<any> {
    this.store.dispatch(new Login(email, password));
    return new Observable((observer) => {
      observer.next({
        message: 'Login successful.',
        user: { email },
      });
      observer.complete();
    });
  }

  // Logout user
  public logout(): Observable<any> {
    this.store.dispatch(new Logout());
    return new Observable((observer) => {
      observer.next({ message: 'Logout successful.' });
      observer.complete();
    });
  }
}
