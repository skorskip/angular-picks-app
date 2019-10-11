import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './user';
import { environment } from '../../../environments/environment';
import { catchError,map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersUrl = environment.serviceURL + 'users';

  currentUser = new User();

  constructor(private http: HttpClient) { }

  login(user: User): Observable<User[]> {
    const url = `${this.usersUrl}/login`;
    return this.http.post(url, user, httpOptions).pipe(
      tap((users: User[]) => {
        this.currentUser = users[0];
        console.log(`fetched user ${user.name}`)
      }),
      catchError(this.handleError<User[]>(`fetched user ${user.name}`))
    );
  }

  register(user: User): Observable<boolean> {
    const url = `${this.usersUrl}/register`;
    return this.http.post(url, user, httpOptions).pipe(
      map((response) => {
        console.log(`updated user ${user.name}`);
        return response == 'SUCCESS';
      }),
      catchError(this.handleError<boolean>(`updated user ${user.name}`))
    );
  }

  update(user: User): Observable<boolean> {
    const url = `${this.usersUrl}/${user.userId}`;
    return this.http.put(url, user, httpOptions).pipe(
      map((response) => {
        console.log(`updated user ${user.name}`, response);
        return response == 'SUCCESS';
      }),
      catchError(this.handleError<boolean>(`updated user ${user.name}`))
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

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
