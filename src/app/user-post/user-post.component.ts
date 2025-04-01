import { ChangeDetectorRef, Component, inject, Input, input, SimpleChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { Post, Type } from '../shared/model/post';
import { NgClass, NgIf, NgStyle } from '@angular/common';
import { AudioPlayerComponent } from "../shared/audio-player/audio-player.component";
import { PhotoComponent } from '../shared/photo/photo.component';
import { VideoComponent } from '../shared/video/video.component';
import { PollComponent } from '../shared/poll/poll.component';
import { MatDialog } from '@angular/material/dialog';
import { UserPostDetailsComponent } from '../user-post-details/user-post-details.component';
import { Auth, user } from '@angular/fire/auth';
import { AuthService } from '../services/auth.service';
import { CustomUser } from '../shared/model/user';
import { UserPostService } from '../services/user-post.service';
import { LikeService } from '../services/like.service';
import { Like } from '../shared/model/like';
import { map } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-post',
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatBadgeModule, NgIf, NgStyle, NgClass, PollComponent, AudioPlayerComponent, PhotoComponent, VideoComponent],
  templateUrl: './user-post.component.html',
  styleUrl: './user-post.component.css'
})
export class UserPostComponent {
  @Input({ required: true }) post!: any;
  @Input() isNews: boolean = false;
  @Input() weatherIcon: string = '';
  postTypes = Type;

  auth = inject(Auth);
  router = inject(Router);
  dialog = inject(MatDialog);

  currentUser: CustomUser = new CustomUser(this.auth);

  profilePictureUrl = 'https://s3.us-east-1.amazonaws.com/real.gram/avatars/';

  like: Like = new Like();
  likedByUser = false;
  allLikes: any[] = [];
  countOfAllLikes = 0;

  constructor(private authService: AuthService, private likeService: LikeService, private userPostService: UserPostService, private changeDetector: ChangeDetectorRef) {
    this.authService.getUsername(this.auth.currentUser?.uid!).subscribe(data => {
      if(data) {
        this.currentUser = data;
        if(this.post) {
          this.getLikes(this.post.id);
        }
      }
    });
  }

  ngOnInit() {
    this.profilePictureUrl = 'https://s3.us-east-1.amazonaws.com/real.gram/avatars/' + this.post.username + '.jpg';
    this.getLikes(this.post.id);
  }

  ngAfterViewInit() {
    this.getLikes(this.post.id);
    this.changeDetector.detectChanges()
  }

  redirectToUserProfile(username: string) {
    this.router.navigate(['/account', username]);
  }

  openDetails() {
    this.dialog.open(UserPostDetailsComponent, { 
      data: this.post,
      width: '600px' 
    });
  }

  getLikes(pid: number) {
    const likes = this.likeService.getAll().snapshotChanges().pipe(
      map(changes => 
        changes.map(c => 
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(likes => {
      let filteredLikes = likes.filter(a => a.pid === this.post.id!);
      let likeRef = filteredLikes.find(a => a.pid === this.post.id!);
      if(likeRef?.username === this.currentUser.username) {
        this.likedByUser = true;
      }
      this.countOfAllLikes = filteredLikes.length;
      this.allLikes = likes as Like[];
    });
  }

  likePost() {
    if(this.likedByUser == true) {
      let likeRef = this.allLikes.find(a => a.pid === this.post.id);
      if(likeRef.key != undefined || '') {
        this.likeService.delete(likeRef.key).then(() => {
          this.likedByUser = false;
        });
      }
    } else {
      this.like.username = this.currentUser.username;
      this.like.pid = this.post.id;
  
      this.likeService.create(this.like).then(() => {
        this.likedByUser = true;
      });
    }
  }

  deletePost() {
    if(this.post.key != undefined || '') {
      this.userPostService.delete(this.post.key);
    }
  }
}
