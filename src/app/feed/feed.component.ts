import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserPostComponent } from '../user-post/user-post.component';
import { Post, Type } from '../shared/model/post';
import { UserPostService } from '../services/user-post.service';
import { map, take } from 'rxjs/operators';
import { HeaderComponent } from "../shared/header/header.component";
import { NewsService } from '../services/news.service';
import { WeatherService } from '../services/weather.service';
import { FortuneCookieService } from '../services/fortune-cookie.service';
import { MatIconModule } from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { user } from '@angular/fire/auth';
import { CommentService } from '../services/comment.service';
import { LikeService } from '../services/like.service';
import { lastValueFrom, of } from 'rxjs';

@Component({
  selector: 'app-feed',
  imports: [NgFor, NgIf, MatCardModule, MatButtonModule, MatIconModule, MatMenuModule, MatProgressSpinnerModule, UserPostComponent, HeaderComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css'
})
export class FeedComponent {
  realPosts: Post[] = [];
  articles: any;
  weatherReports: any;

  sortedPosts: Post[] = [];
  sortOption: string = 'newest';
  showBotPosts: boolean = false;

  constructor(
    private userPostService: UserPostService, 
    private newsService: NewsService, 
    private weatherService: WeatherService, 
    private fortuneCookieService: FortuneCookieService,
    private likeService: LikeService
  ) {}

  ngOnInit(): void {
    this.retrievePosts();
  }

  sortPosts() {
    const userPosts = this.realPosts.filter(post => post.username !== 'WeatherReport' && post.username !== 'FortuneCookie' && !post.is_news);
    const botPosts = this.realPosts.filter(post => post.username === 'WeatherReport' || post.username === 'FortuneCookie' || post.is_news === true);

    let combinedPosts: Post[];

    if(this.showBotPosts) {
      combinedPosts = [...userPosts, ...botPosts];
    } else {
      combinedPosts = userPosts;
    }

    if (this.sortOption === 'oldest') {
      combinedPosts.sort((a, b) => (a.id || 0) - (b.id || 0));
    } else {
      combinedPosts.sort((a, b) => (b.id || 0) - (a.id || 0));
    }
    this.sortedPosts = combinedPosts;
  }

  toggleBotPosts() {
    this.showBotPosts = !this.showBotPosts;
    this.sortPosts();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' } as Intl.DateTimeFormatOptions;

    const day = date.getDate();
    const ordinal = (day: number) => {
      if(day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    const formattedDate = `${day}${ordinal(day)} ${date.toLocaleString('default', {
      month: 'long' })} ${date.getFullYear()}`;

      return formattedDate;
  }

  createPost(post: Post) {
    this.userPostService.getAll().snapshotChanges().pipe(
      map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))),
      take(1)
    ).subscribe(existingPosts => {
      const existingWeatherPost = existingPosts.find(p => p.id === post.id);
      if(!existingWeatherPost) {
        this.userPostService.create(post).catch((err: any) => {
          console.error('Error saving post', err);
        });
      }
    });
  }

  prepareWeatherPosts(weatherReports: any) {
    const latestReport = weatherReports.reduce((latest: any, report: any) => {
      return new Date(report.fetchedAt) > new Date(latest.fetchedAt) ? report : latest;
    });

    const formattedDate = this.formatDate(latestReport.fetchedAt);
    let post = new Post();
    post.id = latestReport.data.location.localtime_epoch;
    post.username = 'WeatherReport'
    post.type = Type.Text;
    post.description = `Today the weather in ${latestReport.data.location.name} looks ${latestReport.data.current.condition.text.toLowerCase()} and it's ${latestReport.data.current.temp_c}°C. Last updated: ${formattedDate}.`;
    post.weather_icon = latestReport.data.current.condition.icon;
    post.url = '';
    this.createPost(post);
  }

  prepareNewsPosts() {
    this.articles.forEach((article: any, index: number) => {
      const uniqueId = new Date(article.fetchedAt).getTime() + index;
      if(!this.realPosts.includes(article.title)) {
        let post = new Post();
        post.id = uniqueId;
        post.type = Type.Photo;
        post.username = article.source;
        post.news_title = article.title;
        post.description = article.description;
        if(article.image) post.url = article.image;
        if(!article.image) post.url = '';
        post.news_source = article.source;
        post.news_published_at = article.publishedAt;
        post.is_news = true;
        this.createPost(post);
      }
    });
  }

  prepareFortuneCookiePosts(fortuneCookies: any) {
    fortuneCookies.forEach((fortuneCookie: any, index: number) => {
      const uniqueId = new Date(fortuneCookie.fetchedAt).getTime() + index;
      let post = new Post();
      post.id = uniqueId;
      post.username = 'FortuneCookie'
      post.type = Type.Text;
      post.news_title = "Fortune Cookie of the Day";
      post.description = fortuneCookie.quote.text;
      post.url = '';
      post.news_published_at = fortuneCookie.fetchedAt;
      this.createPost(post);
    });
  }

  fetchNews() {
    this.newsService.getLatestNews().subscribe(data => {
      this.articles = data;
      this.prepareNewsPosts();
    });
  }

  fetchWeatherReport() {
    this.weatherService.getLatestWeather().subscribe((data) => {
      this.weatherReports = data;
      this.prepareWeatherPosts(this.weatherReports);
    });
  }

  fetchFortuneCookies() {
    this.fortuneCookieService.getFortuneCookieOfTheDay().subscribe((data) => {
      this.prepareFortuneCookiePosts(data);
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
      this.fetchWeatherReport();
      this.fetchNews();
      this.fetchFortuneCookies();
      this.sortPosts();
    });
  }
}
