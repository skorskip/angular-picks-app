export class UserPickLimit {
    user_id: number;
    user_type: string;
    max_picks: number;
    picks_penalty: number;
    date: Date;

    constructor() {
        this.user_id = 0;
        this.user_type = "";
        this.max_picks = 0;
        this.picks_penalty = 0;
        this.date = new Date();
    }
} 