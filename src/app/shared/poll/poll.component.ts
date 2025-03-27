import { Component, inject, Input } from '@angular/core';
import { PollOption, Post } from '../model/post';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { UserPostService } from '../../services/user-post.service';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../../services/auth.service';
import { CustomUser } from '../model/user';
import { NgIf } from '@angular/common';
import { PollChartComponent } from "../poll-chart/poll-chart.component";

@Component({
  selector: 'app-poll',
  imports: [NgIf, MatChipsModule, MatButtonModule, PollChartComponent],
  templateUrl: './poll.component.html',
  styleUrl: './poll.component.css'
})
export class PollComponent {
  @Input({ required: true }) post!: any;
  selectedPollOption: PollOption | undefined = new PollOption();

  auth = inject(Auth);

  alreadyVoted = false;

  constructor(private userPostService: UserPostService) {}

  ngOnInit() {
    this.alreadyVoted = this.checkIfUserVoted();
  }

  checkIfUserVoted(): boolean {
    if(!this.post.usersWhoVoted) {
      return false;
    } else {
      return this.post.usersWhoVoted.includes(this.auth.currentUser!.uid);
    }
  }

  changeSelected($event: any, pollOption: PollOption) {
    if(this.post.usersWhoVoted && !this.alreadyVoted) {
      this.selectedPollOption = pollOption;
      pollOption.votes=pollOption.votes+1;
      this.post.usersWhoVoted.push(this.auth.currentUser!.uid);
      this.updatePollOptions();
    } else if(!this.post.usersWhoVoted) {
      this.selectedPollOption = pollOption;
      pollOption.votes=pollOption.votes+1;
      let usersWhoVotedRef = [this.auth.currentUser!.uid];
      this.post.usersWhoVoted = usersWhoVotedRef;
      this.updatePollOptions();
    }
  }

  updatePollOptions() {
    this.userPostService.update(this.post.key, this.post);
  }
}
