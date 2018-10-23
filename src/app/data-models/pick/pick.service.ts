import { Injectable } from '@angular/core';
import { Pick } from './pick';

@Injectable({ providedIn: 'root' })
export class PickService {
    private picks:Pick[] = [];

    constructor() {}
    addPicks(picks: Pick[]):boolean {
        picks.forEach(element => {
            this.picks.push(element);
        });
        console.log("adding", this.picks);
        return true;
    }

    getPicks():Pick[] {
        console.log("getting", this.picks);
        return this.picks;
    }
}