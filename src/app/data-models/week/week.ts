import { Game } from '../game/game';
import { Team } from '../team/team';

export class Week {
    number: number;
    games: Game[];
    teams: Team[];
    season: number;
    seasonType: number;
    date: Date;

    constructor() {
        this.number = 0;
        this.games = [];
        this.teams = [];
        this.season = 0;
        this.seasonType = 0;
        this.date = new Date();
    }
}