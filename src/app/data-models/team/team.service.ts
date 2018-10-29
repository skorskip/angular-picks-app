import { Injectable } from '@angular/core';
import { Team } from './team';

@Injectable({ providedIn: 'root' })
export class TeamService {

  private teamUrl = 'api/team';  // URL to web api
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
      },
      {
        'id': 107,
        'primaryColor': 'rgba(0,63,45,1)',
        'secondaryColor' : 'rgba(0,0,0,1)',
        'name': 'JETS',
        'abbrevation': 'NYJ',
        'wins': 2,
        'loses': 2
      },
      {
        'id': 108,
        'primaryColor': 'rgba(211,188,141,1)',
        'secondaryColor' : 'rgba(16,24,31,1)',
        'name': 'SAINTS',
        'abbrevation': 'NO',
        'wins': 2,
        'loses': 2
      },
      {
        'id': 109,
        'primaryColor': 'rgba(0,34,68,1)',
        'secondaryColor' : 'rgba(198,12,48,1)',
        'name': 'PATRIOTS',
        'abbrevation': 'ENG',
        'wins': 2,
        'loses': 2
      },
      {
        'id': 110,
        'primaryColor': 'rgba(0,34,68,1)',
        'secondaryColor' : 'rgba(105,190,40,1)',
        'name': 'SEAHAWKS',
        'abbrevation': 'SEA',
        'wins': 2,
        'loses': 2
      },
      {
        'id': 111,
        'primaryColor': 'rgba(26,25,95,1)',
        'secondaryColor' : 'rgba(158,124,12,1)',
        'name': 'RAVENS',
        'abbrevation': 'BAT',
        'wins': 2,
        'loses': 2
      },
      {
        'id': 112,
        'primaryColor': 'rgba(0,142,151,1)',
        'secondaryColor' : 'rgba(242,106,36,1)',
        'name': 'DOLPHINS',
        'abbrevation': 'MIA',
        'wins': 2,
        'loses': 2
      },
      {
        'id': 113,
        'primaryColor': 'rgba(11,22,42,1)',
        'secondaryColor' : 'rgba(200,56,3,1)',
        'name': 'BEARS',
        'abbrevation': 'CHI',
        'wins': 2,
        'loses': 2
      },
      {
        'id': 114,
        'primaryColor': 'rgba(0,51,141,1)',
        'secondaryColor' : 'rgba(198,12,48,1)',
        'name': 'BILLS',
        'abbrevation': 'BUF',
        'wins': 2,
        'loses': 2
      },
      {
        'id': 115,
        'primaryColor': 'rgba(167,25,48,1)',
        'secondaryColor' : 'rgba(0,0,0,1)',
        'name': 'FALCONS',
        'abbrevation': 'ATL',
        'wins': 2,
        'loses': 2
      },
      {
        'id': 116,
        'primaryColor': 'rgba(151,35,63,1)',
        'secondaryColor' : 'rgba(0,0,0,1)',
        'name': 'CARDINALS',
        'abbrevation': 'ARZ',
        'wins': 2,
        'loses': 2
      },
      {
        'id': 117,
        'primaryColor': 'rgba(0,133,202,1)',
        'secondaryColor' : 'rgba(16,24,32,1)',
        'name': 'PANTHERS',
        'abbrevation': 'CAR',
        'wins': 2,
        'loses': 2
      },
      {
        'id': 118,
        'primaryColor': 'rgba(0,118,182,1)',
        'secondaryColor' : 'rgba(176,183,188,1)',
        'name': 'LIONS',
        'abbrevation': 'DET',
        'wins': 2,
        'loses': 2
      }
    ];

    private team: Team;
    private teamByIds: Team[] = [];

  constructor() { }

  /** GET games from the server */
  getTeams (): Team[] {
    return this.teams;
  }

  getTeamByIds (teamIds:number[]): Team[] {
    this.teamByIds = [];
    teamIds.forEach((teamId) => {
      this.teams.forEach((teamItem) => {
        if(teamItem.id == teamId){
          this.teamByIds.push(teamItem);
        }
      });
    });
    return this.teamByIds;
  }

  /** GET game by id. Will 404 if id not found */
  getTeam (id: number): Team {
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