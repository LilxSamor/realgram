import { Component } from '@angular/core';
import { Post, Type } from '../shared/model/post';
import { NgFor, NgIf } from '@angular/common';
import { HeaderComponent } from '../shared/header/header.component';
import { UserPostComponent } from '../user-post/user-post.component';
import { FortuneCookieService } from '../services/fortune-cookie.service';

@Component({
  selector: 'app-fortune',
  imports: [ HeaderComponent, UserPostComponent, NgIf, NgFor ],
  templateUrl: './fortune.component.html',
  styleUrl: './fortune.component.css'
})
export class FortuneComponent {
  posts: Post[] = [];
  fortuneCookies: any;

  constructor(private fortuneCookieService: FortuneCookieService) {}

  ngOnInit() {
    this.fortuneCookieService.getFortuneCookieOfTheDay().subscribe((data) => {
      this.fortuneCookies = data;
      this.createPosts(this.fortuneCookies);
    });
  }
  
  createPosts(fortuneCookies: any) {
    fortuneCookies.forEach((fortuneCookie: any, index: number) => {
      //if(!this.posts.includes(fortuneCookie.quote.text)) {
        let post = new Post();
        post.id = index;
        post.username = 'FortuneCookie'
        post.type = Type.Text;
        post.news_title = "Fortune Cookie of the Day";
        post.description = fortuneCookie.quote.text;
        post.url = '';
        post.news_published_at = fortuneCookie.fetchedAt;
        this.posts.push(post);
      //}
    });
    console.log(this.posts);
    console.log(this.fortuneCookies);
  }
}
