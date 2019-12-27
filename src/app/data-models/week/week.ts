import { Game } from '../game/game';
import { Team } from '../team/team';

export class Week {
    number: number;
    games: Game[];
    teams: Team[];
    season: number;

    constructor() {
        this.number = 0;
        this.games = [];
        this.teams = [];
        this.season = 0;
    }
}