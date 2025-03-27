import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { PollOption } from '../model/post';

@Component({
  selector: 'app-poll-chart',
  imports: [],
  templateUrl: './poll-chart.component.html',
  styleUrl: './poll-chart.component.css'
})
export class PollChartComponent {
  @Input({ required: true }) post!: any;
  @ViewChild('chartCanvasElement') chartCanvasElement!: ElementRef<HTMLCanvasElement>;
  chart: any;

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.createChart();
    this.changeDetector.detectChanges();
  }

  createChart() {
    const ctx = this.chartCanvasElement.nativeElement.getContext('2d');

    let pollOptions: string[] = [];
    let votes: number[] = [];

    this.post.pollOptions.forEach((pollOption: PollOption) => {
      pollOptions.push(pollOption.optionText);
    });

    this.post.pollOptions.forEach((pollOption: PollOption) => {
      votes.push(pollOption.votes);
    });

    this.chart = new Chart(ctx!, {
      type: 'doughnut',
      data: {
        labels: pollOptions,
          datasets: [{
            label: 'Votes',
            data: votes,
            hoverOffset: 4
          }],
      },
      options: {
        aspectRatio: 1.25
      }
    });
  }
}
