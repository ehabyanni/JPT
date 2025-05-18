import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, map, tap } from 'rxjs';
import { AuthState } from '../store/auth/auth.state';

@Injectable({ providedIn: 'root' })
export class IsAuthenticatedGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.store.select(AuthState.currentUser).pipe(
      map((user) => {
        // If user is not logged in, redirect to login
        if (!user) {
          return this.router.createUrlTree(['/login']);
        }
        return true;
      })
    );
  }
}
