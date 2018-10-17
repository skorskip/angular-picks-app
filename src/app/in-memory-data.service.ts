import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Game } from './data-models/game/game';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const games = [
      {
        id: 101,
        number: 101,
        date: 'SUN, OCT 10 @ 04:00PM',
        submitDate: 'SUN, OCT 10 @ 03:00PM',
        homeTeam: 101,
        awayTeam: 102,
        homeScore: 21,
        awayScore: 7,
        spread: '+7.0',
        inProgess: true
      },
      {
        id: 102,
        number: 102,
        date: 'SUN, OCT 10 @ 04:00PM',
        submitDate: 'SUN, OCT 10 @ 03:00PM',
        homeTeam: 103,
        awayTeam: 104,
        homeScore: 21,
        awayScore: 7,
        spread: '+6.0',
        inProgess: true
      },
      {
        id: 103,
        number: 103,
        date: 'SUN, OCT 10 @ 04:00PM',
        submitDate: 'SUN, OCT 10 @ 03:00PM',
        homeTeam: 105,
        awayTeam: 106,
        homeScore: 0,
        awayScore: 0,
        spread: '-3.0',
        inProgess: false
      }
    ];
    return {games};
  }
}