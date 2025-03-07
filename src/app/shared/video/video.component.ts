import { Component, Input } from '@angular/core';
import { Post } from '../model/post';

@Component({
  selector: 'app-video',
  imports: [],
  templateUrl: './video.component.html',
  styleUrl: './video.component.css'
})
export class VideoComponent {
  @Input({ required: true }) post!: Post;
}
