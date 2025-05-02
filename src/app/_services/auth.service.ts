import { Injectable } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';
import { IUser } from '../_interfaces/IUser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  public Register(userData : IUser): Observable<any> {
    let usersRegistered = JSON.parse(
      localStorage.getItem('usersRegistered') || '[]'
    );

    // Check if user already exists
    const userExists = usersRegistered.find(
      (user: IUser) => user.email === userData.email
    );

    if (userExists) {
      return throwError(() => ({
        error: { message: 'User already registered with this email.' },
      }));
    }

    // Register new user
    const newUser = userData;
    usersRegistered.push(newUser);
    localStorage.setItem('usersRegistered', JSON.stringify(usersRegistered));

    return of({
      message: 'Registration successful.',
      user: userData,
    }).pipe(delay(1000));
  }

  public login(email: string, password: string): Observable<any> {
    const usersRegistered = JSON.parse(
      localStorage.getItem('usersRegistered') || '[]'
    );
    
    const usersLogged = JSON.parse(
      localStorage.getItem('usersLogged') || '[]'
    );

    const matchedUser = usersRegistered.find(
      (user: IUser) =>
        user.email === email && user.password === password
    );

    if (matchedUser) {
      usersLogged.push({ matchedUser , time: new Date() });
      localStorage.setItem('usersLogged', JSON.stringify(usersLogged));
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
