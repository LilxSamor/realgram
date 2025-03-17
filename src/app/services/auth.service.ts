import { inject, Injectable, Signal } from '@angular/core';
import { Auth, user, User, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { defer, Observable, of } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { CustomUser } from '../shared/model/user';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { map, switchMap } from 'rxjs/operators';
import { ref } from '@angular/fire/database';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private router: Router = inject(Router)
  public user: Signal<User | null | undefined> = toSignal(user(this.auth));

  private dbPath = '/users';
  customUserRef!: AngularFireList<CustomUser>;
  customUserObjRef: any;

  currentUser!: CustomUser;

  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase, private localStorage: LocalStorageService) {
    this.customUserRef = db.list(this.dbPath);
    this.customUserObjRef = db.database.ref(this.dbPath)
  }

  followUser() {

  }

  createNewUser(user: CustomUser) {
    return this.customUserObjRef.child(`${user.uid}`).set({
      uid: user.uid,
      username: user.username,
      email: user.email,
      picture_url: user.picture_url
    })
  }

  getAll(): AngularFireList<CustomUser> {
      return this.customUserRef;
  }

  getUsername(uid: string): Observable<CustomUser> {
    return this.db.object(`/users/${uid}`).valueChanges().pipe(map(result => {
      return result;
    })) as Observable<CustomUser>
  }

  checkUsername(uid: string, username: string) {
    username = username.toLowerCase()
    return this.db.object(`/Users/${uid}/${username}`)
  }

  loginWithPassword(email: string, password: string): Observable<any> {
    const res = () => signInWithEmailAndPassword(this.auth, email, password);
    return defer(res);
  }

  signUp(username: string, email: string, password: string): Observable<any> {
    const res = () => createUserWithEmailAndPassword(this.auth, email, password);
    return defer(res);
  }

  public async loginWithGoogle() {
    await signInWithPopup(this.auth, new GoogleAuthProvider())
        .then(response => {
          if (response.user) {
            this.router.navigate(['/account']);
          } else {
            console.error('Login failed')
          }
        })
  }

  public async logout() {
      await this.auth.signOut().then(() => {
          this.router.navigate(['/login']);
          this.localStorage.setItem('isUserLoggedIn', 'no');
      });
  }
}
