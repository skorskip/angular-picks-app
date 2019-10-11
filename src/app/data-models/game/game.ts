export class Game {
	game_id: number;
	week: number;
	season: number;
	start_time: string;
	pick_submit_by_date: string;
	home_team: number;
	away_team: number;
	home_team_score: number;
	away_team_score: number;
	home_spread: number;
	//COMPLETED, LIVE, UNPLAYED
	game_status: string;
	winning_team: number;
}