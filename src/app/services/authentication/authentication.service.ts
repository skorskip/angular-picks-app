import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { catchError, tap } from 'rxjs/operators';

import { User } from '../../data-models/user/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Auth } from 'aws-amplify';

let headers = new HttpHeaders({ 'Content-Type' : 'application/json' });
  
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
                    return Auth.completeNewPassword(signInUser, user.password, requiredAttrributes).then(signInNewUser => {
                        return Auth.currentSession().then(result => {
                            localStorage.setItem("token", result.getIdToken().getJwtToken());
                            headers = headers.set('Authorization', result.getIdToken().getJwtToken());
                            return signInUser;
                          });
                    })
                } else {
                    return Auth.currentSession().then(result => {
                        localStorage.setItem("token", result.getIdToken().getJwtToken());
                        headers = headers.set('Authorization', result.getIdToken().getJwtToken());
                        console.log("AWS::", headers);
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
        console.log("HEADERS::", headers);
        return this.http.post<User[]>(url, user, {'headers' : headers})
            .pipe(tap(users => {
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
            }), catchError(this.handleError<User[]>(`fetched current week`)));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.clear();
        this.currentUserSubject.next(null);
    }

    
  // /**
  //  * Handle Http operation that failed.
  //  * Let the app continue.
  //  * @param operation - name of the operation that failed
  //  * @param result - optional value to return as the observable result
  //  */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.snackBar.open('There was failure, please try again later.','', {duration:3000,panelClass:["failure-snack", "quaternary-background", "secondary"]});

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}