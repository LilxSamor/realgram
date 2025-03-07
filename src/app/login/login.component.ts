import { Component, inject, signal } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, merge } from 'rxjs';
import { LocalStorageService } from '../services/local-storage.service';
import { CustomUser } from '../shared/model/user';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  providers: [CommonModule],
  imports: [CommonModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private authService: AuthService = inject(AuthService);
  auth = inject(Auth);
  router = inject(Router);

  readonly username = new FormControl();
  email = new FormControl('', [Validators.required, Validators.email]);
  readonly password = new FormControl();

  errorMessage = signal('');
  hide = signal(true);

  uid?: string = '';

  newUser: CustomUser = new CustomUser(this.auth);

  constructor() {
    this.uid = this.auth.currentUser?.uid;
    merge(this.email.statusChanges, this.email.valueChanges).pipe(takeUntilDestroyed()).subscribe(() => this.updateErrorMessage);
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }

  createUser(uid: string, username: string, email: string): void {
    this.newUser.uid = uid;
    this.newUser.username = username;
    this.newUser.email = email;

    this.authService.createNewUser(this.newUser).then(() => {
      this.router.navigateByUrl('/account');
    });
  }

  public signInWithGoogle() {
    this.authService.loginWithGoogle()
  }

  signUp(username: string, email: string, password: string) {
    this.authService.signUp(username, email, password).pipe().subscribe({
      next: (user) => {
        this.createUser(this.auth.currentUser!.uid, username, email);
      }
    })
  }

}
