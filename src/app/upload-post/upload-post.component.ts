import { Component, inject } from '@angular/core';
import { Post, Type } from '../shared/model/post';
import { UserPostService } from '../services/user-post.service';
import { NgIf } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Auth } from '@angular/fire/auth';
import getStorage  from '@angular/fire/storage';
import { CustomUser } from '../shared/model/user';
import { AuthService } from '../services/auth.service';
import { count } from 'console';
import { map } from 'rxjs';

@Component({
  selector: 'app-upload-post',
  imports: [ NgIf, FormsModule, MatFormFieldModule, MatInputModule ],
  templateUrl: './upload-post.component.html',
  styleUrl: './upload-post.component.css'
})
export class UploadPostComponent {
  auth = inject(Auth);

  post: Post = new Post();
  submitted = false;

  currentUser: CustomUser = new CustomUser(this.auth);
  uid?: string = '';
  username: string = '';

  constructor(private userPostService: UserPostService, private authService: AuthService) {
    this.uid = this.auth.currentUser?.uid;
      this.authService.getUsername(this.uid!).subscribe(data => {
        if(data) {
          this.username = data['username'];
          this.currentUser = data;
        }
      });
  }

  generateId() {
    this.userPostService.getAll().snapshotChanges().pipe(
      map(changes => 
        changes.map(c => 
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.post.id = (data.length + 1);
    });
  }

  savePost(): void {
    this.generateId();
    this.post.username = this.username;
    this.post.type = Type.Text;
    this.post.url = '';

    this.userPostService.create(this.post).then(() => {
      this.submitted = true;
    });
  }

  newPost(): void {
    this.submitted = false;
    this.post = new Post();
  }

  uploadFile(event: any): void {
    const file = event.target.files[0];
    const filePath = ''

    const upload = async () => {
      try {
        // const storage = getStorage();
        
      } catch (e) {
        console.error(e)
      }
    }
  }
}
