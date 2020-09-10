export class UserStanding {
    user_id: number;
    ranking: number;
    user_inits: string;
    user_name: string;
    first_name: string;
    last_name: string;
    wins: number;
    picks: number;
    win_pct: number;
    date: Date;

    constructor() {
        this.user_id = 0;
        this.ranking = 0;
        this.user_inits = '';
        this.user_name = '';
        this.first_name = '';
        this.last_name = '';
        this.wins = 0;
        this.picks = 0;
        this.win_pct = 0;
        this.date = new Date();
    }
}