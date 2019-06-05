import { Injectable } from '@angular/core';
import { Pick } from './pick';

@Injectable({ providedIn: 'root' })
export class PickService {
    private picks:Pick[] = [
        {
            'id' : 100,
            'user': 'pskorski',
            'season':2018,
            'week': 1,
            'gameId':101,
            'teamId':101
        },
        {
            'id' : 101,
            'user': 'pskorski',
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