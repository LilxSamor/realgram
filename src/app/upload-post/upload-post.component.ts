import { Component, inject } from '@angular/core';
import { PollOption, Post, Type } from '../shared/model/post';
import { UserPostService } from '../services/user-post.service';
import { NgFor, NgIf } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormBuilder, FormControl, FormsModule, Validators } from '@angular/forms';
import { Auth } from '@angular/fire/auth';
import getStorage  from '@angular/fire/storage';
import { CustomUser } from '../shared/model/user';
import { AuthService } from '../services/auth.service';
import { count } from 'console';
import { map } from 'rxjs';
import { UploadService } from '../services/upload.service';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-upload-post',
  imports: [ NgIf, FormsModule, MatFormFieldModule, MatStepperModule, MatInputModule, MatButtonModule, MatIconModule, MatChipsModule ],
  templateUrl: './upload-post.component.html',
  styleUrl: './upload-post.component.css'
})
export class UploadPostComponent {
  router = inject(Router);
  auth = inject(Auth);
  
  private _formBuilder = inject(FormBuilder);
  descriptionFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
  });
  fileFormGroup = this._formBuilder.group({
    secondCtrl: [''],
  });

  post: Post = new Post();
  submitted = false;
  isTypePoll = false;

  pollOptions: PollOption[] = [];
  pollOptionInput = '';

  currentUser: CustomUser = new CustomUser(this.auth);
  uid?: string = '';
  username: string = '';

  selectedFile: any = '';
  fileSrc: string = '';

  constructor(private userPostService: UserPostService, private authService: AuthService, private uploadService: UploadService) {
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
    this.post.url = '';
    this.post.pollOptions = this.pollOptions;

    if(this.selectedFile) {
      this.uploadFile();
      this.post.url = 'https://s3.us-east-1.amazonaws.com/real.gram/' + this.selectedFile.name;
      if(this.selectedFile.type.includes('video')) {
        this.post.type = Type.Video;
      } else if (this.selectedFile.type.includes('image')) {
        this.post.type = Type.Photo;
      } else if (this.selectedFile.type.includes('audio')) {
        this.post.type = Type.Audio;
      } 
    } else if(this.pollOptions.length>0) {
      this.post.type = Type.Poll;
    } else {
      this.post.type = Type.Text;
    }

    this.userPostService.create(this.post).then(() => {
      this.submitted = true;
      this.router.navigateByUrl('/feed');
    });
  }

  newPost(): void {
    this.submitted = false;
    this.post = new Post();
  }

  newPollOption(optionText: string): void {
    if(this.pollOptionInput != '') {
      let pollOption = new PollOption();
      pollOption.optionText = optionText;
      this.pollOptions.push(pollOption);
      this.pollOptionInput = '';
    }
  }

  removePollOption(optionText: string): void {
    this.pollOptions = this.pollOptions.filter(option => option.optionText !== optionText);
  }

  uploadFile(): void {
    const file = this.selectedFile;
    this.uploadService.uploadFile(file);
  }

  selectFile(event: any) {
    const reader = new FileReader();
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.fileSrc = reader.result as string;
      }
      this.selectedFile = file;
    }
  }
}
