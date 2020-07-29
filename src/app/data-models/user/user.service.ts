import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './user';
import { UserStanding } from './user-standing';
import { environment } from '../../../environments/environment';
import { catchError,map, tap } from 'rxjs/operators';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { StarGateService } from '../../services/star-gate/star-gate.service';
import { Standings } from './standings';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersUrl = environment.userServiceURL + 'users';
  private standings: BehaviorSubject<UserStanding[]>;
  private userStandings: BehaviorSubject<UserStanding[]>;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private authService: AuthenticationService,
    private starGate: StarGateService) { 
      if(localStorage.getItem('standings') != null) {
        this.standings = new BehaviorSubject<UserStanding[]>(JSON.parse(localStorage.getItem('standings')).standings);
      } else {
        this.standings = new BehaviorSubject<UserStanding[]>(null);
      }
      if(localStorage.getItem('userStandings') != null) {
        this.userStandings = new BehaviorSubject<UserStanding[]>(JSON.parse(localStorage.getItem('userStandings')).standings);
      } else {
        this.userStandings = new BehaviorSubject<UserStanding[]>(null);
      }
    }

  register(user: User): Observable<boolean> {
    let url = `${this.usersUrl}/register`;
    return this.http.post(url, user, httpOptions).pipe(
      map((response) => {
        return response == 'SUCCESS';
      }),
      catchError(this.handleError<boolean>(`register user failed`))
    );
  }

  update(user: User): Observable<boolean> {
    let url = `${this.usersUrl}/${user.user_id}`;
    return this.http.put(url, user, httpOptions).pipe(
      map((response) => {
        return response == 'SUCCESS';
      }),
      catchError(this.handleError<boolean>(`updated user failed`))
    );
  }

  setCurrentUser(fn, ln, username, email, password) {
    var currentUser = JSON.parse(JSON.stringify(this.authService.currentUserValue));

    if(fn != '') { currentUser.first_name = fn; }
    if(ln != '') { currentUser.last_name = ln; }
    if(username != '') { currentUser.user_name = username; }
    if(email != '') { currentUser.email = email; }
    if(password != '') { currentUser.password = password; }
    return currentUser;
  }

  getStandings(season: number, seasonType: number):Observable<UserStanding[]> {
    let url = `${this.usersUrl}/standings/season/${season}/seasonType/${seasonType}`;
    if(this.starGate.allow('standings')) {
      return this.http.get<UserStanding[]>(url).pipe(
        tap((standings: UserStanding[]) => {
          console.log(`get user standings`);
          var object = new Standings();
          object.standings = standings
          localStorage.setItem('standings', JSON.stringify(object));
          this.standings.next(standings);
        }), 
        catchError(this.handleError<UserStanding[]>(`get user standings`))
      );
    } else {
      return this.standings.asObservable();
    }
  }

  getStandingsByUser(season: number, seasonType: number, user: User):Observable<UserStanding[]> {
    let url = `${this.usersUrl}/standings/season/${season}/seasonType/${seasonType}`;
    if(this.starGate.allow('userStandings')){
      return this.http.post(url, user, httpOptions).pipe(
        tap((userStanding: UserStanding[])=> {
          console.log(`get user standings`);
          var object = new Standings();
          
          if(userStanding.length === 0) {
            object.standings[0] = new UserStanding();
            userStanding[0] = new UserStanding();
          } else {
            object.standings = userStanding;
          }

          localStorage.setItem('userStandings', JSON.stringify(object));
          this.userStandings.next(userStanding);
        }), 
        catchError(this.handleError<UserStanding[]>(`get user standings`))
      );
    } else {
      return this.userStandings.asObservable();
    }
  }

    // /**
  //  * Handle Http operation that failed.
  //  * Let the app continue.
  //  * @param operation - name of the operation that failed
  //  * @param result - optional value to return as the observable result
  //  */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.snackBar.open(error,'', {duration:3000});
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
