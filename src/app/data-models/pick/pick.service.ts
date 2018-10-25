import { Injectable } from '@angular/core';
import { Pick } from './pick';

@Injectable({ providedIn: 'root' })
export class PickService {
    private picks:Pick[] = [];
    id:number = 0;

    constructor() {}
    addPicks(picks: Pick[]):boolean {
        picks.forEach(element => {
            element.id = this.id
            this.id = this.id + 1;
            this.picks.push(element);
        });
        return true;
    }

    deletePick(pickId: number){
        this.picks.forEach((element,i) => {
            if(element.id == pickId) {
                this.picks.splice(i,1);
            }
        });
    }
    
    updatePick(pickUpdate:Pick){
        this.picks.forEach((element,i) => {
            if(element.id == pickUpdate.id) {
                console.log("UPDATING", pickUpdate);
                this.picks.splice(i,1,pickUpdate);
                console.log(this.picks);
            }
        });
    }

    getPicks():Pick[] {
        return this.picks;
    }
}