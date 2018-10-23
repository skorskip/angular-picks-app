import { Game } from '../game/game';
import { Team } from '../team/team';

export class Week {
    id: number;
    number: number;
    games: number[];
    teams: number[];
    date: string;
}