import { Component, inject, signal } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, user } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, merge } from 'rxjs';
import { LocalStorageService } from '../services/local-storage.service';
import { CustomUser } from '../shared/model/user';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { UploadService } from '../services/upload.service';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-login',
  providers: [CommonModule],
  imports: [CommonModule, MatTabsModule, MatButtonModule, MatStepperModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private authService: AuthService = inject(AuthService);
  auth = inject(Auth);
  router = inject(Router);

  readonly usernameSignup = new FormControl();
  emailSignup = new FormControl('', [Validators.required, Validators.email]);
  readonly passwordSignup = new FormControl();

  readonly usernameLogin = new FormControl();
  readonly passwordLogin = new FormControl();

  private _formBuilderSignup = inject(FormBuilder);
  private _formBuilderLogin = inject(FormBuilder);

  usernameFormGroupSignup = this._formBuilderSignup.group({
    firstCtrl: ['', Validators.required],
  });
  emailFormGroupSignup = this._formBuilderSignup.group({
    secondCtrl: ['', Validators.required, Validators.email],
  });
  passwordFormGroupSignup = this._formBuilderSignup.group({
    firstCtrl: ['', Validators.required],
  });
  pictureFormGroupSignup = this._formBuilderSignup.group({
    secondCtrl: ['', Validators.required, Validators.email],
  });

  usernameFormGroupLogin = this._formBuilderLogin.group({
    firstCtrl: ['', Validators.required],
  });
  emailFormGroupLogin = this._formBuilderLogin.group({
    secondCtrl: ['', Validators.required, Validators.email],
  });
  passwordFormGroupLogin = this._formBuilderLogin.group({
    firstCtrl: ['', Validators.required],
  });

  errorMessage = signal('');
  hide = signal(true);

  uid?: string = '';

  newUser: CustomUser = new CustomUser(this.auth);

  selectedFile: any = '';
  fileSrc: string = '';

  constructor(private uploadService: UploadService, private localStorage: LocalStorageService) {
    this.uid = this.auth.currentUser?.uid;
    merge(this.emailSignup.statusChanges, this.emailSignup.valueChanges).pipe(takeUntilDestroyed()).subscribe(() => this.updateErrorMessage);
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  updateErrorMessage() {
    if (this.emailSignup.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.emailSignup.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }

  createUser(uid: string, username: string, email: string): void {
    this.newUser.uid = uid;
    this.newUser.username = username.toLowerCase();
    this.newUser.email = email;

    const fileExtension = this.selectedFile.name.split('.').pop()
    this.newUser.picture_url = 'https://s3.us-east-1.amazonaws.com/real.gram/avatars/' + this.newUser.username + '.' + fileExtension;

    this.authService.createNewUser(this.newUser).then(() => {
      // this.router.navigateByUrl('/account');
      this.router.navigate(['/account', this.newUser.username]);
      this.uploadPfp(this.newUser.username);
      this.localStorage.setItem('isUserLoggedIn', 'yes');
      this.localStorage.setItem('currentUsername', this.newUser.username);
    });
  }

  public signInWithGoogle() {
    this.authService.loginWithGoogle()
  }

  signIn(username: string, password: string) {
    this.authService.getAll().snapshotChanges().pipe(
      map(changes => 
        changes.map(c => 
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(users => {
      let userToSignIn = users.find(a => a.username === username);
      this.authService.loginWithPassword(userToSignIn!.email!, password).pipe().subscribe({
        next: (user) => {
          // this.router.navigateByUrl('/account');
          this.router.navigate(['/account', username]);
          this.localStorage.setItem('isUserLoggedIn', 'yes');
          this.localStorage.setItem('currentUsername', username);
        }
      })
    });
  }

  signUp(username: string, email: string, password: string) {
    this.authService.signUp(username, email, password).pipe().subscribe({
      next: (user) => {
        this.createUser(this.auth.currentUser!.uid, username, email);
      }
    })
  }

  uploadPfp(username: string): void {
    const file = this.selectedFile;
    this.uploadService.uploadPfp(file, username);
  }

  selectFile(event: any) {
    const reader = new FileReader();
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.fileSrc = reader.result as string;
      }
      this.selectedFile = file;
    }
  }

}
