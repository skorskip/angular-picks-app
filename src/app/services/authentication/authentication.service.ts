import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import { User } from '../../data-models/user/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Auth } from 'aws-amplify';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    private usersUrl = environment.userServiceURL + 'users';

    constructor(
        private http: HttpClient, 
        private snackBar: MatSnackBar,) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(user: User): Observable<any> {
        return from(Auth.signIn(user.user_name, user.password)).pipe(map(signInUser => {
            if(signInUser?.username) {
                if(signInUser.challengeName === 'NEW_PASSWORD_REQUIRED') {
                    const { requiredAttrributes } = signInUser.challengeParam;
                    Auth.completeNewPassword(signInUser, user.password, requiredAttrributes).then(signInNewUser => {
                        Auth.currentSession().then(result => {
                            localStorage.setItem("token", result.getIdToken().getJwtToken());
                            return signInUser;
                          });
                    })
                } else {
                    Auth.currentSession().then(result => {
                        localStorage.setItem("token", result.getIdToken().getJwtToken());
                        return signInUser;
                    });
                }
            } else {
                this.snackBar.open('Wrong username or password','', {duration:3000, panelClass:["failure-snack", "quaternary-background", "secondary"]});
                return null;
            }
        }));
    }

    getUserInfo(user: User): Observable<User[]> {
        const url = `${this.usersUrl}/login`;
        return this.http.post<User[]>(url, user, httpOptions)
            .pipe(map(users => {
                if(users.length > 0){
                    if(users[0].status === "active") {
                        localStorage.setItem('currentUser', JSON.stringify(users[0]));
                        this.currentUserSubject.next(users[0]);
                        return users;
                    } else {
                        this.snackBar.open('Your account has been de-activated :(','', {duration:3000, panelClass:["failure-snack", "quaternary-background", "secondary"]});
                        return users;
                    }
                } else {
                    this.snackBar.open('Wrong username or password','', {duration:3000, panelClass:["failure-snack", "quaternary-background", "secondary"]});
                }
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.clear();
        this.currentUserSubject.next(null);
    }
}