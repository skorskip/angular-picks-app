import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Pick } from 'src/app/data-models/pick/pick';
import { PickService } from 'src/app/data-models/pick/pick.service';
import { Team } from 'src/app/data-models/team/team';
import { TeamService } from 'src/app/data-models/team/team.service';

@Component({
  selector: 'app-pick-peek-modal',
  templateUrl: './pick-peek-modal.component.html',
  styleUrls: ['./pick-peek-modal.component.scss']
})
export class PickPeekModalComponent implements OnInit {

  @Input() firstname = "";
  @Input() lastname = "";
  @Input() inits = "";
  @Input() userId = 0;
  @Input() season = 0;
  @Input() seasonType = 0;
  @Input() week = 0;
  @Output() close = new EventEmitter();

  teams = [] as Team[];
  picks = [] as Pick[];
  displayTeams = [] as Team[];
  showLoader = false;

  constructor(
    private picksService: PickService,
    private teamService: TeamService
  ) {}

  ngOnInit(): void {
    this.showLoader = true;
    this.picksService.getUsersPicksByWeek(this.userId, this.season, this.seasonType, this.week).subscribe((result) => {
      result = {
        "date": new Date(),
        "picks": [
          {
            "pick_id": 3211,
            "game_id": 344,
            "team_id": 23,
            "user_id": 16,
            "submitted_date": new Date()
          },
          {
            "pick_id": 3213,
            "game_id": 346,
            "team_id": 27,
            "user_id": 16,
            "submitted_date": new Date()
          },
          {
            "pick_id": 3212,
            "game_id": 351,
            "team_id": 30,
            "user_id": 16,
            "submitted_date": new Date()
          },
          {
            "pick_id": 3302,
            "game_id": 352,
            "team_id": 18,
            "user_id": 16,
            "submitted_date": new Date()
          }
        ],
        "teams": [
          {
            "team_id": 8,
            "team_name": "xBrowns",
            "abbreviation": "xCLE",
            "primary_color": "rgba(49,29,0,1)",
            "secondary_color": "rgba(255,60,0,1)",
            "display_color": "brown"
          },
          {
            "team_id": 12,
            "team_name": "xPackers",
            "abbreviation": "xGB",
            "primary_color": "rgba(24,48,40,1)",
            "secondary_color": "rgba(255,184,28,1)",
            "display_color": "jungle-green"
          },
          {
            "team_id": 18,
            "team_name": "xRams",
            "abbreviation": "xLAR",
            "primary_color": "rgba(0,34,68,1)",
            "secondary_color": "rgba(134,109,75,1)",
            "display_color": "navy"
          },
          {
            "team_id": 23,
            "team_name": "xGiants",
            "abbreviation": "xNYG",
            "primary_color": "rgba(1,35,82,1)",
            "secondary_color": "rgba(163,13,45,1)",
            "display_color": "air-force-blue"
          },
          {
            "team_id": 27,
            "team_name": "xSteelers",
            "abbreviation": "xPIT",
            "primary_color": "rgba(255,182,18,1)",
            "secondary_color": "rgba(16,24,32,1)",
            "display_color": "gold"
          },
          {
            "team_id": 28,
            "team_name": "x49ers",
            "abbreviation": "xSF",
            "primary_color": "rgba(170,0,0,1)",
            "secondary_color": "rgba(173,153,93,1)",
            "display_color": "ruby"
          },
          {
            "team_id": 30,
            "team_name": "xBuccaneers",
            "abbreviation": "xTB",
            "primary_color": "rgba(213,10,10,1)",
            "secondary_color": "rgba(10,10,8,1)",
            "display_color": "burgundy"
          },
          {
            "team_id": 32,
            "team_name": "xFootball Team",
            "abbreviation": "xWAS",
            "primary_color": "rgba(63,16,16,1)",
            "secondary_color": "rgba(255,182,18,1)",
            "display_color": "ruby"
          }
        ],
        "games": [
          {
            "game_id": 344,
            "season": 2020,
            "week": 6,
           "start_time": "2020-10-18T17:00:00.000Z",
            "away_team_id": 32,
            "home_team_id": 23,
            "home_spread": -3,
            "pick_submit_by_date": "2020-10-18T17:00:00.000Z",
            "game_status": "COMPLETED",
            "current_quarter": null,
            "seconds_left_in_quarter": null,
            "away_team_score": 19,
            "home_team_score": 20,
            "winning_team_id": 32
          },
          {
            "game_id": 346,
            "season": 2020,
            "week": 6,
            "start_time": "2020-10-18T17:00:00.000Z",
            "away_team_id": 8,
            "home_team_id": 27,
            "home_spread": -3.5,
            "pick_submit_by_date": "2020-10-18T17:00:00.000Z",
            "game_status": "COMPLETED",
            "current_quarter": null,
            "seconds_left_in_quarter": null,
            "away_team_score": 7,
            "home_team_score": 38,
            "winning_team_id": 27
          },
          {
            "game_id": 351,
            "season": 2020,
            "week": 6,
            "start_time": "2020-10-18T20:25:00.000Z",
            "away_team_id": 12,
            "home_team_id": 30,
            "home_spread": 1.5,
            "pick_submit_by_date": "2020-10-18T20:25:00.000Z",
            "game_status": "COMPLETED",
            "current_quarter": null,
            "seconds_left_in_quarter": null,
            "away_team_score": 10,
            "home_team_score": 38,
            "winning_team_id": 30
          },
          {
            "game_id": 352,
            "season": 2020,
            "week": 6,
            "start_time": "2020-10-19T00:20:00.000Z",
            "away_team_id": 18,
            "home_team_id": 28,
            "home_spread": 3.5,
            "pick_submit_by_date": "2020-10-19T00:20:00.000Z",
            "game_status": "COMPLETED",
            "current_quarter": null,
            "seconds_left_in_quarter": null,
            "away_team_score": 16,
            "home_team_score": 24,
            "winning_team_id": 28
          }
        ]
      }
      this.teams = JSON.parse(JSON.stringify(result.teams));
      this.picks = JSON.parse(JSON.stringify(result.picks));
      this.getPickedTeams(this.picks, this.teams);
    });
  }

  teamLoaded(event: Team) {
    this.teamService.highlightSelectTeam(event);
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    var modal = document.getElementById("modal-container");
    if((event.target == modal)) {
      this.close.emit(true);
    }
  }

  getPickedTeams(picks: Pick[], teams: Team[]) {
    picks.forEach((pick) => {
      this.displayTeams.push(this.teamService.getTeamLocal(pick.team_id, teams));
    });
    this.showLoader = false;
  }

  viewPicks() {

  }

  closeClick() {
    this.close.emit(true);
  }
}
