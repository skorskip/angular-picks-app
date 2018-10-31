import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
@Component({
  selector: 'app-my-stats',
  templateUrl: './my-stats.component.html',
  styleUrls: ['./my-stats.component.css']
})
export class MyStatsComponent implements OnInit {

  picksChart = [];
  chartLabels = ["week 1", "week 2", "week 3", "week 4"];
  numberWins = [2,3, 1,6];
  numberLoss = [0, -1, -3, 0];
  
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
            borderColor: "white",
            backgroundColor:"#ffffff78",
            fill: true,
            pointRadius: 10
          },
          {
            data: this.numberLoss,
            borderColor: "white",
            backgroundColor: "#ffffff78",
            fill: true,
            pointRadius: 10
          }
        ]
      },
      options: {
        legend: {
          display: false,
          fullWidth: false,
        },
        onClick: this.graphClicked.bind(this),
        scales: {
          xAxes: [{
            display: true,
            gridLines: {
              display:true,
              color: "white"
            },
            ticks: {
              fontColor: "white",
              fontFamily: "Comfortaa"
            }
          }],
          yAxes: [{
            display: true,
            gridLines: {
              color: "transparent",
              display: true,
              drawBorder: false,
              zeroLineColor: "white",
              zeroLineWidth: 1
            },
            ticks: {
              fontColor: "white",
              fontFamily: "Comfortaa"
            }
          }]
        }
      }
    })
  }

  graphClicked(event, array){
    console.log("ARRAY", array._index);
    }

}
