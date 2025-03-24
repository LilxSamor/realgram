import { Component, Input } from '@angular/core';
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
  @Input({ required: true }) chartName!: string;
  chart: any;

  ngAfterViewInit() {
    this.createChart();
  }

  createChart() {
    let chartExist = Chart.getChart(this.chartName);
    if (chartExist != undefined) {
      chartExist.destroy();
    }

    let pollOptions: string[] = [];
    let votes: number[] = [];

    this.post.pollOptions.forEach((pollOption: PollOption) => {
      pollOptions.push(pollOption.optionText);
    });

    this.post.pollOptions.forEach((pollOption: PollOption) => {
      votes.push(pollOption.votes);
    });

    console.log(pollOptions);
    console.log(votes);

    this.chart = new Chart(this.chartName, {
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
