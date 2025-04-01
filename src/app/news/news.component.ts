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

  createPosts() {
    const posts: Post[] = [];
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
        posts.push(post);
      }
    });
    this.removeDuplicates(posts);
  }

  removeDuplicates(posts: Post[]) {
    const titles = new Set();
    this.posts = posts.filter(({ news_title }) => !titles.has(news_title) && titles.add(news_title));
  }

  fetchNews() {
    this.newsService.getNews().subscribe(data => {
      this.articles = data.data;
      this.createPosts();
    });
  }
}
