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
        return true;
    }

    deletePick(pickId: number){
        this.picks.forEach((element,i) => {
            if(element.id === pickId) {
                this.picks.splice(i,1);
            }
        });
    }
    
    updatePick(pickUpdate:Pick){
        this.picks.forEach((element,i) => {
            if(element.id === pickUpdate.id) {
                this.picks.splice(i,1,pickUpdate);
            }
        });
    }

    getPicks():Pick[] {
        return this.picks;
    }
}