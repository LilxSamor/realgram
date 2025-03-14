import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { UserPostComponent } from '../user-post/user-post.component';
import { Post } from '../shared/model/post';
import { UserPostService } from '../services/user-post.service';
import { map } from 'rxjs/operators';
import { HeaderComponent } from "../shared/header/header.component";

@Component({
  selector: 'app-feed',
  imports: [NgFor, MatCardModule, MatButtonModule, UserPostComponent, HeaderComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css'
})
export class FeedComponent {
  realPosts: Post[] = [];

  constructor(private userPostService: UserPostService) {}

  ngOnInit(): void {
    this.retrievePosts();
  }

  retrievePosts(): void {
    this.userPostService.getAll().snapshotChanges().pipe(
      map(changes => 
        changes.map(c => 
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      let sortedData = data.sort((a, b) =>  b.id! - a.id!)
      this.realPosts = sortedData as Post[];
    });
  }
}
