import { LeagueMessageSource } from './league-message-source'
export class League {
    currentWeek: number;
    currentSeason: number;
    maxTotalPicks: number;
    seasonStart: Date;
    messageSource: LeagueMessageSource;
    seasonEndWeek: number;
    date: Date;
}