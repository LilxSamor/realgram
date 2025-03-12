import { Component, inject, Input, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Post, Type } from '../shared/model/post';
import { NgIf } from '@angular/common';
import { AudioPlayerComponent } from "../shared/audio-player/audio-player.component";
import { PhotoComponent } from '../shared/photo/photo.component';
import { VideoComponent } from '../shared/video/video.component';
import { PollComponent } from '../shared/poll/poll.component';
import { MatDialog } from '@angular/material/dialog';
import { UserPostDetailsComponent } from '../user-post-details/user-post-details.component';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../services/auth.service';
import { CustomUser } from '../shared/model/user';
import { UserPostService } from '../services/user-post.service';

@Component({
  selector: 'app-user-post',
  imports: [MatCardModule, MatButtonModule, MatIconModule, NgIf, PollComponent, AudioPlayerComponent, PhotoComponent, VideoComponent],
  templateUrl: './user-post.component.html',
  styleUrl: './user-post.component.css'
})
export class UserPostComponent {
  @Input({ required: true }) post!: Post;
  postTypes = Type;
  auth = inject(Auth);
  dialog = inject(MatDialog);

  currentUser: CustomUser = new CustomUser(this.auth);

  constructor(private authService: AuthService, private userPostService: UserPostService) {
    this.authService.getUsername(this.auth.currentUser?.uid!).subscribe(data => {
      if(data) {
        this.currentUser = data;
      }
    });
  }

  openDetails() {
    this.dialog.open(UserPostDetailsComponent, { data: this.post });
  }

  deletePost() {
    // this.userPostService.delete(this.post.key!);
  }
}
