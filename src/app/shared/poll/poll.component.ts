import { Component, Input } from '@angular/core';
import { Post } from '../model/post';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-poll',
  imports: [ MatChipsModule, MatButtonModule ],
  templateUrl: './poll.component.html',
  styleUrl: './poll.component.css'
})
export class PollComponent {
  @Input({ required: true }) post!: Post;
  readonly mockPollOptions: string[] = ['Bern', 'Zürich'];
}
