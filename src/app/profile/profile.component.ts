import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import { UserPostComponent } from "../user-post/user-post.component";
import { NgFor, NgIf } from '@angular/common';
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

@Component({
  selector: 'app-profile',
  imports: [NgFor, NgIf, MatButtonModule, MatDividerModule, MatIconModule, MatProgressSpinnerModule, MatTabsModule, UserPostComponent],
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

  constructor(private route: ActivatedRoute, private localStorage: LocalStorageService, private userPostService: UserPostService, private authService: AuthService, private followService: FollowService) {
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
