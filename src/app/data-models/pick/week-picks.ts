import { Pick } from './pick';
import { Team } from '../team/team';
import { Game } from '../game/game';

export class WeekPicks {
    picks: Pick[];
    teams: Team[];
    games: Game[];
    date: Date;

    constructor(){
        this.picks = [] as Pick[];
        this.teams = [] as Team[];
        this.games = [] as Game[];
        this.date = new Date();
    }
}