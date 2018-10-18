import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Team } from './team';

@Injectable({ providedIn: 'root' })
export class TeamService {

  private teamUrl = 'api/teams';  // URL to web api
  private teams: Team[] = [
      {
          'id': 101,
          'primaryColor': 'rgba(1,35,82,1)',
          'secondaryColor' : 'rgba(163,13,45,1)',
          'name': 'GIANTS',
          'abbrevation': 'NYG',
          'wins': 3,
          'loses': 1
      },
            {
          'id': 102,
          'primaryColor': 'rgba(24,48,40,1)',
          'secondaryColor' : 'rgba(255,184,28,1)',
          'name': 'PACKERS',
          'abbrevation': 'GB',
          'wins': 0,
          'loses': 4
      },
            {
          'id': 103,
          'primaryColor': 'rgba(0,34,68,1)',
          'secondaryColor' : 'rgba(134,109,75,1)',
          'name': 'RAMS',
          'abbrevation': 'LAR',
          'wins': 0,
          'loses': 4
      },
            {
          'id': 104,
          'primaryColor': 'rgba(207,34,52,1)',
          'secondaryColor' : 'rgba(255,184,28,1)',
          'name': 'CHIEFS',
          'abbrevation': 'KC',
          'wins': 2,
          'loses': 2
      },
      {
        'id': 105,
        'primaryColor': 'rgba(79,38,131,1)',
        'secondaryColor' : 'rgba(255,198,47,1)',
        'name': 'VIKINGS',
        'abbrevation': 'MN',
        'wins': 2,
        'loses': 2
    },
    {
      'id': 106,
      'primaryColor': 'rgba(251,79,20,1)',
      'secondaryColor' : 'rgba(0,0,0,1)',
      'name': 'BENGALS',
      'abbrevation': 'CIN',
      'wins': 2,
      'loses': 2
  }
    ];

    private team: Team;

  constructor() { }

  /** GET games from the server */
  getTeams (): Team[] {
    return this.teams;
  }

  /** GET game by id. Will 404 if id not found */
  getTeam (id: number): Team {
    team: Team;
    this.teams.forEach((teamItem) => {
      if(teamItem.id === id){
        this.team = teamItem;
      }
    });
    return this.team;
  }

  //////// Save methods //////////

  /** PUT: update the game on the server */
  updateTeam (team: Team): any {
   //implement
  }
}