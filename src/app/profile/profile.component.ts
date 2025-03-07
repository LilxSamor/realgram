import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import { UserPostComponent } from "../user-post/user-post.component";
import { POSTS } from '../shared/model/mock-posts';
import { NgFor } from '@angular/common';
import { UserPostService } from '../services/user-post.service';
import { Post } from '../shared/model/post';
import { map } from 'rxjs/operators';
import { LocalStorageService } from '../services/local-storage.service';
import { Auth, User } from '@angular/fire/auth';
import { AuthService } from '../services/auth.service';
import { CustomUser } from '../shared/model/user';

@Component({
  selector: 'app-profile',
  imports: [NgFor, MatDividerModule, MatIconModule, MatTabsModule, UserPostComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent {
  auth = inject(Auth);
  
  posts = POSTS;

  // realPosts?: Post[];
  realPosts: Post[] = [];
  
  currentUser: CustomUser = new CustomUser(this.auth);
  uid?: string = '';
  username?: string = '';

  constructor(private userPostService: UserPostService, private authService: AuthService) {
    this.uid = this.auth.currentUser?.uid;
    this.authService.getUsername(this.uid!).subscribe(data => {
      if(data) {
        this.username = data['username'];
        this.currentUser = data;
      }
    });
  }

  ngOnInit(): void {
    this.posts = POSTS;
    this.retrievePosts();
  }

  getUsername(): void {

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
      /*
      for(let key of data){
        let p = new Post();
        p.id = key.id;

        this.realPosts.push(p);
      } */
      allPosts.forEach(post => {
        console.log(post);
        console.log(this.username);
        if(post.username === this.username) {
          userPosts.push(post as Post);
        }
      })
      let sortedData = userPosts.sort((a, b) =>  b.id! - a.id!)
      this.realPosts = sortedData as Post[];
    });
  }
}
