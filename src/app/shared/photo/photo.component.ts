import { Component, Input } from '@angular/core';
import { Post } from '../model/post';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-photo',
  imports: [],
  templateUrl: './photo.component.html',
  styleUrl: './photo.component.css'
})
export class PhotoComponent {
  @Input({ required: true }) post!: Post;
}
