import { Component } from '@angular/core';
import { NewsService } from '../services/news.service';
import { UserPostComponent } from '../user-post/user-post.component';
import { HeaderComponent } from '../shared/header/header.component';
import { NgFor, NgIf } from '@angular/common';
import { Post, Type } from '../shared/model/post';

@Component({
  selector: 'app-news',
  imports: [HeaderComponent, UserPostComponent, NgIf, NgFor],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent {
  posts: Post[] = [];
  articles: any;

  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.fetchNews();
  }

  createPosts() {
    this.articles.forEach((article: any, index: number) => {
      if(!this.posts.includes(article.title)) {
        let post = new Post();
        post.id = index;
        post.type = Type.Photo;
        post.news_title = article.title;
        post.description = article.description;
        post.url = article.image;
        post.news_source = article.source;
        post.news_published_at = article.published_at;
        this.posts.push(post);
      }
    });
    console.log(this.posts);
  }

  fetchNews() {
    this.newsService.getLatestNews().subscribe(data => {
      console.log(data);
      this.articles = data;
      this.createPosts();
    });
  }
}
