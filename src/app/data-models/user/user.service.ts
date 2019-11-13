import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './user';
import { UserStanding } from './user-standing';
import { environment } from '../../../environments/environment';
import { catchError,map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersUrl = environment.serviceURL + 'users';

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private authService: AuthenticationService) { }

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
    var currentUser = this.authService.currentUserValue;
    if(fn != '') currentUser.first_name = fn;
    if(ln != '') currentUser.last_name = ln;
    if(username != '') currentUser.user_name = username;
    if(email != '') currentUser.email = email;
    if(password != '') currentUser.password = password;
    return currentUser;
}

getStandings(season: number):Observable<UserStanding[]> {
  let url = `${this.usersUrl}/standings/${season}`;
  return this.http.get<UserStanding[]>(url).pipe(
    tap(_ => console.log(`get user standings`)), 
    catchError(this.handleError<UserStanding[]>(`get user standings`))
  );
}

    // /**
  //  * Handle Http operation that failed.
  //  * Let the app continue.
  //  * @param operation - name of the operation that failed
  //  * @param result - optional value to return as the observable result
  //  */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.snackBar.open(error.statusText.toLowerCase(),'', {duration:3000});
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
