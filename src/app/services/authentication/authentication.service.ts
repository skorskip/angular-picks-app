import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import { User } from '../../data-models/user/user';
import { MatSnackBar } from '@angular/material/snack-bar';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    private usersUrl = environment.serviceURL + 'users';

    constructor(
        private http: HttpClient, 
        private snackBar: MatSnackBar,) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(user: User): Observable<User[]> {
        const url = `${this.usersUrl}/login`;
        return this.http.post<User[]>(url, user, httpOptions)
            .pipe(map(users => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                if(users.length > 0){
                    localStorage.setItem('currentUser', JSON.stringify(users[0]));
                    this.currentUserSubject.next(users[0]);
                    return users;
                } else {
                    this.snackBar.open('Wrong username or password','', {duration:3000});
                }
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.clear();
        this.currentUserSubject.next(null);
    }
}