import { Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { FeedComponent } from './feed/feed.component';
import { UploadPostComponent } from './upload-post/upload-post.component';
import { AuthGuard } from './services/auth.guard';
import { LoginComponent } from './login/login.component';
import { UserSearchComponent } from './user-search/user-search.component';

export const routes: Routes = [
    { path: '', redirectTo: 'feed', pathMatch: 'full' },
    { path: 'account/:username', component: ProfileComponent, },
    { path: 'feed', component: FeedComponent },
    { path: 'upload', component: UploadPostComponent },
    { path: 'login', component: LoginComponent },
    { path: 'search', component: UserSearchComponent },
];
