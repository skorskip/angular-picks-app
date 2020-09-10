import { UserStanding } from './user-standing';
export class Standings {
    standings : UserStanding[];
    date: Date;

    constructor() {
        this.standings = [] as UserStanding[];
        this.date = new Date();
    }
}