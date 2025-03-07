import { Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { FeedComponent } from './feed/feed.component';
import { UploadPostComponent } from './upload-post/upload-post.component';
import { AuthGuard } from './services/auth.guard';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    { path: '', redirectTo: 'feed', pathMatch: 'full' },
    { path: 'account', component: ProfileComponent, /*canActivate: [AuthGuard]*/ },
    { path: 'feed', component: FeedComponent },
    { path: 'upload', component: UploadPostComponent },
    { path: 'login', component: LoginComponent },
];
