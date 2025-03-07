import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { ProfileComponent } from "./profile/profile.component";
import { NavigationComponent } from "./shared/navigation/navigation.component";

@Component({
  selector: 'app-root',
  imports: [NavigationComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'REALGRAM';
}
