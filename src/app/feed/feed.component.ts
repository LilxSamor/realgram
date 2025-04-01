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

@Component({
  selector: 'app-feed',
  imports: [NgFor, NgIf, MatCardModule, MatButtonModule, MatProgressSpinnerModule, UserPostComponent, HeaderComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css'
})
export class FeedComponent {
  realPosts: Post[] = [];
  articles: any;
  weatherReports: any;

  constructor(private userPostService: UserPostService, private newsService: NewsService, private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.retrievePosts();
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

  createWeatherPost(weatherReports: any) {
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

  fetchNews() {
    /*
    this.newsService.getNews().subscribe(data => {
      this.articles = data.data;
      console.log(this.articles);
    });*/
  }

  fetchWeatherReport() {
    this.weatherService.getLatestWeather().subscribe((data) => {
      this.weatherReports = data;
      this.createWeatherPost(this.weatherReports);
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
    });
  }
}
