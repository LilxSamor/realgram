import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import { UserPostComponent } from "../user-post/user-post.component";
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { UserPostService } from '../services/user-post.service';
import { Post } from '../shared/model/post';
import { map } from 'rxjs/operators';
import { LocalStorageService } from '../services/local-storage.service';
import { Auth, User } from '@angular/fire/auth';
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

@Component({
  selector: 'app-profile',
  imports: [NgFor, NgIf, NgStyle, MatButtonModule, MatDividerModule, MatIconModule, MatProgressSpinnerModule, MatTabsModule, UserPostComponent, ImageCropperComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent {
  auth = inject(Auth);

  realPosts: Post[] = [];
  
  userOfShownProfile?: CustomUser;
  currentUser: CustomUser = new CustomUser(this.auth);
  uid?: string = '';
  username?: string = '';

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

  constructor(
    private route: ActivatedRoute, 
    private localStorage: LocalStorageService, 
    private userPostService: UserPostService, 
    private authService: AuthService, 
    private followService: FollowService,
    private uploadService: UploadService,
    private db: AngularFireDatabase
  ) {
    // this.uid = this.auth.currentUser?.uid;
    this.username = this.route.snapshot.paramMap.get('username') as string;

    this.authService.getUsername(this.auth.currentUser!.uid).subscribe(data => {
      if(data) {
        this.currentUser = data;
        if(this.currentUser.username == this.username) {
          this.isProfileOfUser = true;
        }
      }
    });
  }

  ngOnInit(): void {
    this.retrievePosts();
    this.getUser();
    this.getFollowers();
  }

  updateProfilePicture() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.click();

    fileInput.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const selectedFile = target?.files?.[0];

      if(selectedFile) {
        const reader = new FileReader();

        reader.onload = (e) => {
          this.imageChangedEvent = selectedFile;
          /*
          this.imageChangedEvent = {
            target: {
              files: [selectedFile]
            }
          };*/
        };

        reader.readAsDataURL(selectedFile);
      } else {
        console.error('No file selected');
      }
    };
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.blob;
    console.log('Cropped image:', this.croppedImage);

    const fileName = this.username + '.jpeg';

    const reader = new FileReader();
    reader.readAsDataURL(this.croppedImage);
    reader.onload = () => {
      this.fileSrc = reader.result as string; // Set the preview source
    };

    this.uploadService.uploadPfp(this.croppedImage, this.croppedImage.name, this.username!).then(() => {
      this.updateProfilePictureInFirebase(fileName);
    }).catch(error => console.error('Upload failed', error));
  }

  imageLoaded() {
    console.log("Image loaded");
  }

  loadImageFailed() {
    console.error("Image loading failed");
  }

  updateProfilePictureInFirebase(fileName: string) {
    const fileExtension = fileName.split('.').pop();
    const url = `https://s3.us-east-1.amazonaws.com/real.gram/avatars/${this.username}.${fileExtension}`;

    this.db.database.ref(`users/${this.uid}`).update({
      picture_url: url,
    });
  }

  get profilePictureUrl(): string {
    return `https://s3.us-east-1.amazonaws.com/real.gram/avatars/${this.username}.jpg`;
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
      if(this.currentUserFollow) (
        this.currentUserFollowsShownUser = true
      )
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
