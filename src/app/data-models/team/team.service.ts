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
          'primaryColor': 'rgba(0, 40,106,1)',
          'name': 'GIANTS',
          'abbrevation': 'NYG',
          'city': 'NEW YORK CITY',
          'wins': 3,
          'loses': 1
      },
            {
          'id': 102,
          'primaryColor': 'rgba(23,100,40,1)',
          'name': 'PACKERS',
          'abbrevation': 'GB',
          'city': 'GREEN BAY',
          'wins': 0,
          'loses': 4
      },
            {
          'id': 103,
          'primaryColor': 'rgba(0,28,51,1)',
          'name': 'RAMS',
          'abbrevation': 'LAR',
          'city': 'LOS ANGELOS',
          'wins': 0,
          'loses': 4
      },
            {
          'id': 104,
          'primaryColor': 'rgba(207,34,52,1)',
          'name': 'CHIEFS',
          'abbrevation': 'KC',
          'city': 'KANSAS CITY',
          'wins': 2,
          'loses': 2
      },
      {
        'id': 105,
        'primaryColor': 'rgba(88,51,139,1)',
        'name': 'VIKINGS',
        'abbrevation': 'MN',
        'city': 'MINNESOTA',
        'wins': 2,
        'loses': 2
    },
    {
      'id': 106,
      'primaryColor': 'rgba(255,88,0,1)',
      'name': 'BENGALS',
      'abbrevation': 'CIN',
      'city': 'CINCINNATI',
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