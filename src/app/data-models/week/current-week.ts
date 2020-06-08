import { MatGridTileHeaderCssMatStyler } from '@angular/material/grid-list';

export class CurrentWeek {
    season: number;
    week: number;
    seasonType: number;
    date: Date;

    constructor() {
        this.season = 0;
        this.week = 0;
        this.seasonType = 0;
        this.date = new Date();
    }
}