export class Game {
	id: number;
	week: number;
	season: number;
	date: string;
	submitDate: string;
	homeTeam: number;
	awayTeam: number;
	homeScore: number;
	awayScore: number;
	spread: number;
	//COMPLETED, INPROGRESS, PENDING
	progress: string;
	isOn: number;
}