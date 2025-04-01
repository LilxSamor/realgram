import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserPostComponent } from '../user-post/user-post.component';
import { Post, Type } from '../shared/model/post';
import { UserPostService } from '../services/user-post.service';
import { map } from 'rxjs/operators';
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

  createWeatherPost(weatherReports: any) {
    const latestReport = weatherReports.reduce((latest: any, report: any) => {
      return new Date(report.fetchedAt) > new Date(latest.fetchedAt) ? report : latest;
    });
    let post = new Post();
    post.id = latestReport.data.location.localtime_epoch;
    post.username = 'WeatherReport'
    post.type = Type.Text;
    post.description = 'The weather today in ' + latestReport.data.location.name + ' is ' + latestReport.data.current.condition.text.toLowerCase() + ". It's " + latestReport.data.current.temp_c + '°C.';
    post.weather_icon = latestReport.data.current.condition.icon;
    this.realPosts.unshift(post);
  }

  fetchNews() {
    this.newsService.getNews().subscribe(data => {
      this.articles = data.data;
      console.log(this.articles);
    });
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
