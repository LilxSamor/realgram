import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../../services/auth.service';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-navigation',
    imports: [MatIconModule, MatDividerModule, RouterModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {
  private router: Router = inject(Router);
  uid?: string;
  username?: string;

  constructor(private localStorage: LocalStorageService) {}

  redirectToUserProfile() {
    this.username = this.localStorage.getItem('currentUsername') as string;
    this.router.navigate(['/account', this.username]);
  }
}
