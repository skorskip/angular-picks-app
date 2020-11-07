import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Pick } from 'src/app/data-models/pick/pick';
import { PickService } from 'src/app/data-models/pick/pick.service';
import { Team } from 'src/app/data-models/team/team';
import { TeamService } from 'src/app/data-models/team/team.service';
import { slideUpAnimation, fadeAnimation } from 'src/app/animations/app-routing-animation';
import { CurrentWeek } from 'src/app/data-models/week/current-week';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pick-peek-modal',
  templateUrl: './pick-peek-modal.component.html',
  styleUrls: ['./pick-peek-modal.component.scss'],
  animations: [slideUpAnimation,fadeAnimation]
})
export class PickPeekModalComponent implements OnInit {

  @Input() firstname = "";
  @Input() lastname = "";
  @Input() inits = "";
  @Input() userId = 0;
  @Input() week = new CurrentWeek();
  @Output() close = new EventEmitter();
  @Output() viewFullPicks = new EventEmitter();

  teams = [] as Team[];
  picks = [] as Pick[];
  displayTeams = [] as Team[];
  showLoader = false;
  showModal = false;

  constructor(
    private router:Router,
    private picksService: PickService,
    private teamService: TeamService
  ) {}

  ngOnInit(): void {
    this.showLoader = true;
    this.showModal = true;
    this.picksService.getUsersPicksByWeek(this.userId, this.week.season, this.week.seasonType, this.week.week).subscribe((result) => {
      this.teams = JSON.parse(JSON.stringify(result.teams));
      this.picks = JSON.parse(JSON.stringify(result.picks));
      this.getPickedTeams(this.picks, this.teams);
    });
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    var modal = document.getElementById("modal-container");
    if((event.target == modal)) {
      this.showModal = false;
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
    this.viewFullPicks.emit(this.userId);
    this.router.navigate(['/standings/'+ this.userId])
  }

  closeClick() {
    this.showModal = false;
    this.close.emit(true);
  }
}
