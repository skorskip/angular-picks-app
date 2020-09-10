export class User {
    user_id: number;
    user_inits: string;
    first_name: string;
    last_name: string;
    user_name: string;
    password: string;
    email: string;
    status: string;
    type: string;
    last_login_date: Date;

    constructor() {
        this.user_id = 0;
        this.user_name = "";
        this.password = "";
        this.email = "";
        this.first_name = "";
        this.last_name = "";
        this.status = "";
        this.type = "";
        this.last_login_date = new Date();
    }
}