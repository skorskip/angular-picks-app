export class Game {
	gameId: number;
	week: number;
	season: number;
	date: string;
	submitDate: string;
	homeTeam: number;
	awayTeam: number;
	homeScore: number;
	awayScore: number;
	spread: number;
	//COMPLETED, INPROGRESS, UNPLAYED
	status: string;
	isOn: number;
}