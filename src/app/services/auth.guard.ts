import { Injectable, inject } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private auth: Auth, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const user = this.auth.currentUser;
        if (user) {
            console.log("User is authenticated:", user.uid);
            return true;
        }
        console.log("User is not authenticated");
        this.router.navigate(['/login']);
        return false;
    }
}