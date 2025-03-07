import { NgIf } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { AudioPlayerComponent } from '../shared/audio-player/audio-player.component';
import { Post, Type } from '../shared/model/post';
import { PhotoComponent } from '../shared/photo/photo.component';
import { PollComponent } from '../shared/poll/poll.component';
import { VideoComponent } from '../shared/video/video.component';

@Component({
  selector: 'app-user-post-details',
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule, NgIf, PollComponent, AudioPlayerComponent, PhotoComponent, VideoComponent],
  templateUrl: './user-post-details.component.html',
  styleUrl: './user-post-details.component.css'
})
export class UserPostDetailsComponent {
  post = inject(MAT_DIALOG_DATA);
  postTypes = Type;
}
