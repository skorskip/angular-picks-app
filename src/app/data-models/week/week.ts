import { Game } from '../game/game';

export class Week {
    id: number;
    number: number;
    games: Game[];
    teams: number[];
    season: number;
}