import { Injectable } from '@angular/core';
import { Pick } from './pick';

@Injectable({ providedIn: 'root' })
export class PickService {
    private picks:Pick[] = [
        {
            'pickId' : 100,
            'userId': 'pskorski',
            'season':2018,
            'week': 1,
            'gameId':101,
            'teamId':101
        },
        {
            'pickId' : 101,
            'userId': 'pskorski',
            'season':2018,
            'week': 1,
            'gameId':102,
            'teamId':104
        }
    ];
    id:number = 102;

    constructor() {}
    addPicks(picks: Pick[]):boolean {
        picks.forEach(element => {
            element.pickId = this.id
            this.id = this.id + 1;
            this.picks.push(element);
        });
        return true;
    }

    deletePick(pickId: number){
        this.picks.forEach((element,i) => {
            if(element.pickId == pickId) {
                this.picks.splice(i,1);
            }
        });
    }
    
    updatePick(pickUpdate:Pick){
        this.picks.forEach((element,i) => {
            if(element.pickId == pickUpdate.pickId) {
                this.picks.splice(i,1,pickUpdate);
            }
        });
    }

    getPicksByWeek(season:number, week:number):Pick[] {
        var picksByWeek: Pick[] = [];
        this.picks.forEach((pick,i) =>{
            if(pick.season == season && pick.week == week){
                picksByWeek.push(pick);
            }
        });
        return picksByWeek;
    }

    getPicks():Pick[] {
        return this.picks;
    }
}