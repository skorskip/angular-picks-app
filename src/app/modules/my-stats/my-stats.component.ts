import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-my-stats',
  templateUrl: './my-stats.component.html',
  styleUrls: ['./my-stats.component.css']
})
export class MyStatsComponent implements OnInit {
  
  picksChart = [];
  picksCountChart = [];
  chartLabels = ["week 1", "week 2", "week 3", "week 4"];
  doughnutLabels = ["correct", "incorrect"];
  numberOfPicks = [.60, .40];
  totalNumberOfPicks= [];
  numberWins = [2,3, 1,6];
  numberLoss = [0, -1, -3, 0];
  
  constructor(
    private router:Router,
    private dialog:MatDialog
  ) { }

  ngOnInit() {
    this.initPicksGraphChart();
    this.initPicksDoughnutChart();
  }

  initPicksDoughnutChart(){
    this.picksCountChart = new Chart('pick-counts-chart', {
      type:'doughnut',
      data: {
        labels: this.doughnutLabels,
        datasets: [
          {
            data: this.numberOfPicks,
            backgroundColor:["#ffffff","#ffffff78"]
          }
        ]
      },
      options: {
        aspectRatio: 1,
        responsive: true,
        maintainAspectRatio: true,
        legend:{
          display: false,
          fullWidth: false
        }
      }
    })
  }

  initPicksGraphChart(){
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
    const dialogRef = this.dialog.open(NavigateToPicksDialog);
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.router.navigate(['/myPicks/' + (array[0]._index + 101)]);
      }
    });
  }
}

@Component({
  selector: 'navigate-to-picks-dialog',
  templateUrl: '../../components/dialog-content/navigate-to-picks-dialog.html',
})
export class NavigateToPicksDialog {}
