import { NgIf } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { Post } from '../model/post';

@Component({
  selector: 'app-audio-player',
  imports: [ NgIf, MatIconModule, MatProgressBarModule ],
  templateUrl: './audio-player.component.html',
  styleUrl: './audio-player.component.css'
})
export class AudioPlayerComponent {
  @Input({ required: true }) post!: Post;
  audio1 = 'https://samplelib.com/lib/preview/mp3/sample-3s.mp3';

  @ViewChild('aud') audioElement!: ElementRef<HTMLAudioElement>;
  @ViewChild('progressBar') progressBar!: ElementRef<HTMLDivElement>;
  isPlaying = false;

  ngAfterViewInit() {
    const player = this.audioElement.nativeElement;
    if (!player) return;
    
    player.addEventListener('timeupdate', updateProgress.bind(this));
    function updateProgress(this: any) {
      const duration = player.duration;
      const currentTime = player.currentTime;
      const progress = (currentTime / duration) * 100;
      this.progressBar.nativeElement.style.width = progress + '%';
      if(player.currentTime == player.duration) {
        this.isPlaying = false;
      }
    }
  }

  play() {
    if (this.audioElement?.nativeElement) {
      const playInst = this.audioElement.nativeElement;
      if (playInst.paused) {
        playInst.play();
        this.isPlaying = true;
      } else {
        playInst.pause();
        this.isPlaying = false;
      }
    }
  }
}
