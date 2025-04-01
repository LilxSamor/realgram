import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserPostComponent } from '../user-post/user-post.component';
import { Post } from '../shared/model/post';
import { UserPostService } from '../services/user-post.service';
import { map } from 'rxjs/operators';
import { HeaderComponent } from "../shared/header/header.component";
import { NewsService } from '../services/news.service';

@Component({
  selector: 'app-feed',
  imports: [NgFor, NgIf, MatCardModule, MatButtonModule, MatProgressSpinnerModule, UserPostComponent, HeaderComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css'
})
export class FeedComponent {
  realPosts: Post[] = [];
  articles: any;

  constructor(private userPostService: UserPostService, private newsService: NewsService) {}

  ngOnInit(): void {
    this.retrievePosts();
    // this.fetchNews();
  }

  fetchNews() {
    this.newsService.getNews().subscribe(data => {
      this.articles = data.data;
      console.log(this.articles);
    });
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
