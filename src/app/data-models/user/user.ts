export class User {
    user_id: number;
    first_name: string;
    last_name: string;
    user_name: string;
    password: string;
    email: string;

    constructor() {
        this.user_id = 0;
        this.user_name = "";
        this.password = "";
        this.email = "";
        this.first_name = "";
        this.last_name = "";
    }
}