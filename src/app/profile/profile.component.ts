import { ChangeDetectorRef, Component, inject, NgZone, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import { UserPostComponent } from "../user-post/user-post.component";
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { UserPostService } from '../services/user-post.service';
import { Post } from '../shared/model/post';
import { map } from 'rxjs/operators';
import { LocalStorageService } from '../services/local-storage.service';
import { Auth, user, User } from '@angular/fire/auth';
import { AuthService } from '../services/auth.service';
import { CustomUser } from '../shared/model/user';
import { ActivatedRoute } from '@angular/router';
import { FollowService } from '../services/follow.service';
import { Follow } from '../shared/model/follow';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { UploadService } from '../services/upload.service';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { FormsModule } from '@angular/forms';
import { EditableDirective } from '../shared/directive/editable.directive';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  imports: [NgFor, NgIf, NgStyle, MatButtonModule, MatDividerModule, MatIconModule, MatProgressSpinnerModule, MatTabsModule, UserPostComponent, FormsModule, EditableDirective],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnDestroy {
  private auth = inject(Auth);

  realPosts: Post[] = [];
  userOfShownProfile?: CustomUser;
  currentUser: CustomUser = new CustomUser(this.auth);
  uid?: string = '';
  username?: string = '';
  profilePictureUrl: string = '';
  currentUserFollowsShownUser = false;
  currentUserFollow: any;
  following: number = 0;
  followers: number = 0;
  countOfUserPosts: number = 0;
  isProfileOfUser = false;
  isHovered: boolean = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  fileSrc: string = '';
  alreadySelectedFile = false;

  private routeSub: Subscription;

  constructor(
    private route: ActivatedRoute, 
    private localStorage: LocalStorageService, 
    private userPostService: UserPostService, 
    private authService: AuthService, 
    private followService: FollowService,
    private uploadService: UploadService,
    private db: AngularFireDatabase,
    private changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone) {
      this.routeSub = this.route.paramMap.subscribe(params => {
        this.username = params.get('username') as string;
        console.log("Navigated to profile for username:", this.username);
        this.performProfileLoad();
      });
      /*
    this.route.paramMap.subscribe(params => {
      this.username = params.get('username') as string;

      if(this.auth.currentUser) {
        this.uid = this.auth.currentUser.uid;
        this.loadUserProfile(this.uid);
      }
    });*/
  }

  ngOnDestroy() {
    if(this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  private performProfileLoad() {
    const user = this.auth.currentUser;
    if(user) {
      console.log("User authenticated:", user.uid);
      this.uid = user.uid;
      this.loadUserProfile(this.uid)
    } else {
      console.log("No user found. Waiting for auth state...");
      this.auth.onAuthStateChanged(authUser => {
        if(authUser) {
          console.log("User authenticated after waiting:", authUser.uid);
          this.uid = authUser.uid;
          this.loadUserProfile(this.uid);
        } else {
          console.warn('User is not authenticated');
        }
      });
    }
  }

  loadUserProfile(uid: string): void {
    /*
    if(this.auth.currentUser) {
      this.uid = this.auth.currentUser.uid;
      this.authService.getUsername(this.uid).subscribe(data => {
        if(data) {
          this.currentUser = data;
          this.isProfileOfUser = this.currentUser.username === this.username;

          if(this.isProfileOfUser) {
            this.profilePictureUrl = this.currentUser.picture_url ?? '';
          }
          this.updateUserProfile();
        }
      }, error => {
        console.error('Error fetching username:', error);
      });
    } else {
      console.warn('User is not authenticated');
    }*/
    
    if(uid && this.username) {
      console.log("Loading profile for UID:", this.uid);
      this.authService.getUsername(uid).subscribe(data => {
        if(data) {
          console.log("Profile data fetched successfully:", data);
          this.currentUser = data;
          this.isProfileOfUser = this.currentUser.username === this.username;

          if(this.isProfileOfUser) {
            this.profilePictureUrl = this.currentUser.picture_url ?? '';
          }
          this.updateUserProfile();
        } else {
          console.error('No data returned for user:', this.username);
        }
      }, error => {
        console.error('Error fetching username:', error);
      });
    }
  }

  updateUserProfile(): void {
    this.realPosts = [];
    this.getUser();
    this.getFollowers();
    this.retrievePosts();
  }

  updateProfilePicture() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.click();

    fileInput.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const selectedFile = target?.files?.[0];
      this.alreadySelectedFile = true;

      if(selectedFile) {
        this.uploadFile(selectedFile);
        /*
        const reader = new FileReader();

        reader.onload = (e) => {
          console.log('FileReader result:', e.target?.result); // Log the result

          if(reader.result) {
            this.ngZone.run(() => {
              this.imageChangedEvent = {
                target: {
                  files: [selectedFile]
                }
              };
              this.fileSrc = e.target?.result as string;
              console.log('Image changed event:', this.imageChangedEvent);
              this.changeDetectorRef.detectChanges();
            });
          }
        };

        reader.readAsDataURL(selectedFile);
*/
      } else {
        console.error('No file selected');
      }
    };
  }

  imageCropped(event: ImageCroppedEvent) {
    console.log('Cropped image event:', event);
    if (event) {
      console.log('Cropped event data:', event); // This should log the crop data
      this.croppedImage = event.blob;
      const reader = new FileReader();
      reader.readAsDataURL(this.croppedImage);
      reader.onload = () => {
        this.ngZone.run(() => {
          this.fileSrc = reader.result as string; // Set the preview source
        });
      };

      console.log('Cropped image:', this.croppedImage);

      const fileName = this.username + '.jpeg';

      this.uploadService.uploadPfp(this.croppedImage, this.croppedImage.name, this.username!).then(() => {
      }).catch(error => console.error('Upload failed', error));
    } else {
        console.log('No crop event passed!');
    }    
  }

  imageLoaded() {
    console.log("Image loaded");
  }

  loadImageFailed() {
    console.error("Image loading failed");
  }

  cropperReady() {
    // cropper ready
  }

  uploadFile(file: File) {
    const fileName = this.username + '.jpg';
    this.uploadService.uploadPfp(file, fileName, this.username!).then(() => {
      this.updateProfilePictureUrlInFirebase(fileName);
    }).catch(error => console.error('Upload failed', error));
  }

  updateProfilePictureUrlInFirebase(fileName: string) {
    this.uid = this.auth.currentUser?.uid;
    const fileExtension = fileName.split('.').pop();
    const url = `https://s3.us-east-1.amazonaws.com/real.gram/avatars/${this.username}.${fileExtension}?v=${Date.now()}`;
    this.db.database.ref(`users/${this.uid}`).update({
      picture_url: url,
    }).then(() => {
      this.profilePictureUrl = url;
    }).catch(error => {
      console.error('Error updating profile picture URL:', error);
    });
  }

  getUser(): void {
    this.authService.getAll().snapshotChanges().pipe(
      map(changes => 
        changes.map(c => 
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(allUsers => {
      this.userOfShownProfile = allUsers.find(a => a.username === this.username) as CustomUser;
      if(this.userOfShownProfile) {
        this.profilePictureUrl = this.userOfShownProfile.picture_url || '';
      }
    });
  }

  getFollowers(): void {
    this.followService.getAll().snapshotChanges().pipe(
      map(changes => 
        changes.map(c => 
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(allFollows => {
      let filteredFollowers = allFollows.filter(a => a.username === this.username);
      let filteredFollowing = allFollows.filter(a => a.username_follower === this.username);
      this.currentUserFollow = allFollows.find(a => a.username_follower === this.currentUser.username && a.username === this.username);
      this.followers = filteredFollowers.length;
      this.following = filteredFollowing.length;
      this.currentUserFollowsShownUser = !!this.currentUserFollow;
      /*
      if(this.currentUserFollow) (
        this.currentUserFollowsShownUser = true
      )*/
    });
  }

  followUser(): void {
    if(!this.currentUserFollowsShownUser) {
      let newFollow = new Follow();
      newFollow.username = this.username as string;
      newFollow.username_follower = this.currentUser.username;
      this.followService.create(newFollow).then(() => {
        this.currentUserFollowsShownUser = true;
      });
    }
  }

  unfollowUser(): void {
    if(this.currentUserFollowsShownUser) {
      this.followService.delete(this.currentUserFollow.key).then(() => {
        this.currentUserFollowsShownUser = false;
        this.currentUserFollow = null;
      });
    }
  }

  retrievePosts(): void {
    let userPosts: Post[] = [];
    this.userPostService.getAll().snapshotChanges().pipe(
      map(changes => 
        changes.map(c => 
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(allPosts => {
      allPosts.forEach(post => {
        if(post.username === this.username) {
          userPosts.push(post as Post);
        }
      })
      let sortedData = userPosts.sort((a, b) =>  b.id! - a.id!)
      this.countOfUserPosts = sortedData.length;
      this.realPosts = sortedData as Post[];
    });
  }

  signOut(): void {
    this.authService.logout();
  }
}
