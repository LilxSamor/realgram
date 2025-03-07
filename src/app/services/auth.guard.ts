import { Injectable, inject } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);
  private user$ = user(this.auth);

  canActivate(): Observable<boolean> {
      const currentRoute = this.router.routerState.snapshot.url;
      const currentRouteIsLogin = currentRoute === '/login';

      return this.user$.pipe(
          map((user) => {
              if (user) {
                  return true;
              } else if (user && currentRouteIsLogin) {
                  this.router.navigate(['/']);
                  return false
              } else {
                  this.router.navigate(['/login']);
                  return false;
              }
          })
      );
  }
}