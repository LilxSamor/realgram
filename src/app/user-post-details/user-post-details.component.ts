import { NgFor, NgIf } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AudioPlayerComponent } from '../shared/audio-player/audio-player.component';
import { Post, Type } from '../shared/model/post';
import { PhotoComponent } from '../shared/photo/photo.component';
import { PollComponent } from '../shared/poll/poll.component';
import { VideoComponent } from '../shared/video/video.component';
import { CommentService } from '../services/comment.service';
import { AuthService } from '../services/auth.service';
import { CustomUser } from '../shared/model/user';
import { Auth } from '@angular/fire/auth';
import { map } from 'rxjs';
import { UserComment } from '../shared/model/comment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-post-details',
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule, NgIf, NgFor, PollComponent, AudioPlayerComponent, PhotoComponent, VideoComponent],
  templateUrl: './user-post-details.component.html',
  styleUrl: './user-post-details.component.css'
})
export class UserPostDetailsComponent {
  auth = inject(Auth);
  router = inject(Router);
  dialogRef = inject(MatDialogRef<UserPostDetailsComponent>);
  post = inject(MAT_DIALOG_DATA);
  postTypes = Type;

  allComments: UserComment[] = [];

  commentInput: any;

  comment: UserComment = new UserComment();
  submitted = false;
  
  currentUser: CustomUser = new CustomUser(this.auth);
  uid?: string = '';
  username: string = '';

  constructor(private commentService: CommentService, private authService: AuthService) {
    this.uid = this.auth.currentUser?.uid;
    this.authService.getUsername(this.uid!).subscribe(data => {
      if(data) {
        this.username = data['username'];
        this.currentUser = data;
        this.retrieveComments();
      }
    });
  }

  redirectToUserProfile(username: string) {
    this.router.navigate(['/account', username]);
    this.dialogRef.close();
  }

  retrieveComments(): void {
    this.commentService.getAll().snapshotChanges().pipe(
      map(changes => 
        changes.map(c => 
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      const filteredData = data.filter(item => item.pid === this.post.id);
      let sortedData = filteredData.sort((a, b) =>  b.id! - a.id!)
      this.allComments = sortedData as UserComment[];
    });
  }
  
  generateId() {
    this.comment.id = 0;
    this.commentService.getAll().snapshotChanges().pipe(
      map(changes => 
        changes.map(c => 
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.comment.id = (data.length + 1);
    });
  }
  
  saveComment(): void {
    this.generateId();
    this.comment.pid = this.post.id;
    this.comment.username = this.username;
    this.comment.uid = this.auth.currentUser!.uid;
    this.comment.comment = this.commentInput;

    this.commentService.create(this.comment).then(() => {
      this.submitted = true;
      this.commentInput = '';
    });
  }

  newComment(): void {
    this.submitted = false;
    this.post = new Post();
  }
}
