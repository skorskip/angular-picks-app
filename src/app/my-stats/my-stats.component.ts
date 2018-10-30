import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
@Component({
  selector: 'app-my-stats',
  templateUrl: './my-stats.component.html',
  styleUrls: ['./my-stats.component.css']
})
export class MyStatsComponent implements OnInit {

  picksChart = [];
  chartLabels = ["week 1", "week 2", "week 3", "week 4", "week 5", "week 6"];
  numberWins = ["2", "3", "1", "6", "2"];
  numberLoss = ["0", "1", "3", "0", "1"];
  constructor() { }

  ngOnInit() {
    this.initChart();
  }

  initChart(){
    this.picksChart = new Chart('picks-chart', {
      type: 'line',
      data: {
        labels: this.chartLabels,
        datasets: [
          {
            data: this.numberWins,
            borderColor: "lightgreen",
            backgroundColor:"#90ee907a",
            fill: true,
            pointRadius: 5
          },
          {
            data: this.numberLoss,
            borderColor: "lightcoral",
            backgroundColor: "#f080807a",
            fill: true,
            pointRadius: 5
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true,
            gridLines: {
              display:false
            }
          }],
          yAxes: [{
            display: true,
            gridLines: {
              display:false
            }
          }]
        }
      }
    })
  }

}
