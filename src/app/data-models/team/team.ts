export class Team {
	team_id: number;
	primary_color: string;
	secondary_color: string;
	team_name: string;
	abbreviation: string;

	constructor() {
		this.team_id = 0;
		this.primary_color = "";
		this.secondary_color = "";
		this.team_name = "";
		this.abbreviation = "";
	}
}