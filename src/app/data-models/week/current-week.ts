export class CurrentWeek {
    season: number;
    week: number;
    date: Date;

    constructor() {
        this.season = 0;
        this.week = 0;
        this.date = new Date();
    }
}