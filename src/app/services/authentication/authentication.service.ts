import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { catchError, tap } from 'rxjs/operators';

import { User } from '../../data-models/user/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Auth } from 'aws-amplify';
import { createUrlResolverWithoutPackagePrefix } from '@angular/compiler';

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

    login(username: string, password: string): Observable<any> {
        return from(Auth.signIn({username: username, password: password})).pipe(map(signInUser => {
            if(signInUser?.username) {
                if(signInUser.challengeName === 'NEW_PASSWORD_REQUIRED') {
                    return signInUser;
                } else {
                    return Auth.currentSession().then(result => {
                        localStorage.setItem("token", result.getIdToken().getJwtToken());
                        headers = headers.set('Authorization', result.getIdToken().getJwtToken());
                        return signInUser;
                    });
                }
            } else {
                this.snackBar.open('Wrong username or password','', {duration:3000, panelClass:["failure-snack", "quaternary-background", "secondary"]});
                return null;
            }
        }), catchError(this.handleError<any>(`attempt login`)));
    }

    completePasswordLogin(newPassword: string, authUser: any): Observable<any> {
        const { requiredAttrributes } = authUser.challengeParam;
        return from(Auth.completeNewPassword(authUser, newPassword, requiredAttrributes)).pipe(map(newUser => {
            return Auth.currentSession().then(result => {
                localStorage.setItem("token", result.getIdToken().getJwtToken());
                headers = headers.set('Authorization', result.getIdToken().getJwtToken());
                return newUser;
              });
        }), catchError(this.handleError<any>('attempt new password')));
    }

    forgotPassword(username, code, password): Observable<any> {
        return from(Auth.forgotPasswordSubmit(username, code, password)).pipe(map(newUser => {
            return Auth.currentSession().then(result => {
                localStorage.setItem("token", result.getIdToken().getJwtToken());
                headers = headers.set('Authorization', result.getIdToken().getJwtToken());
                return newUser;
              });
        }), catchError(this.handleError<any>('attempt forgot password')));

    }

    getUserInfo(username: string, password: string): Observable<User[]> {
        const url = `${this.usersUrl}/login`;
        var user = new User();
        user.password = password;
        user.user_name = username;

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
            }), catchError(this.handleError<User[]>(`attempt login`)));
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
      this.snackBar.open('Incorrect username or password.','', {duration:3000,panelClass:["failure-snack", "quaternary-background", "secondary"]});

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}