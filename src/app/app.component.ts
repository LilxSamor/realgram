import { Component, inject, ViewEncapsulation } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { ProfileComponent } from "./profile/profile.component";
import { NavigationComponent } from "./shared/navigation/navigation.component";
import { Auth } from '@angular/fire/auth';
import { LocalStorageService } from './services/local-storage.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [NavigationComponent, RouterOutlet, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  auth = inject(Auth);
  router = inject(Router)

  title = 'REALGRAM';

  isUserLoggedIn;

  constructor(private localStorage: LocalStorageService) {
    this.isUserLoggedIn = this.localStorage.getItem('isUserLoggedIn');
    if(!this.isUserLoggedIn) {
      this.router.navigateByUrl('/login');
    }
    console.log(this.isUserLoggedIn);
  }
}
