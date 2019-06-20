import { Game } from '../game/game';

export class Week {
    number: number;
    games: Game[];
    teams: number[];
    season: number;

    constructor() {
        this.number = 0;
        this.games = [];
        this.teams = [];
        this.season = 0;
    }
}