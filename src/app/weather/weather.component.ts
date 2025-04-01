import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { UserPostComponent } from '../user-post/user-post.component';
import { NgFor, NgIf } from '@angular/common';
import { WeatherService } from '../services/weather.service';
import { Post, Type } from '../shared/model/post';

@Component({
  selector: 'app-weather',
  imports: [ HeaderComponent, UserPostComponent, NgIf, NgFor ],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.css'
})
export class WeatherComponent {
  posts: Post[] = [];
  weatherAlerts: any;
  weatherReports: any;

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    this.weatherService.getLatestWeather().subscribe((data) => {
      this.weatherReports = data;
      this.createPosts(this.weatherReports);
    });
  }

  createPosts(weatherReports: any) {
    const latestReport = weatherReports.reduce((latest: any, report: any) => {
      return new Date(report.fetchedAt) > new Date(latest.fetchedAt) ? report : latest;
    });

    console.log(latestReport.data);
    let post = new Post();
    post.id = latestReport.data.location.localtime_epoch;
    post.username = 'WeatherReports'
    post.type = Type.Text;
    post.description = 'The weather today in ' + latestReport.data.location.name + ' is ' + latestReport.data.current.condition.text.toLowerCase() + ". It's " + latestReport.data.current.temp_c + '°C.';
    post.weather_icon = latestReport.data.current.condition.icon;
    this.posts.push(post);
    console.log(post.weather_icon);
  }
}
