import { Injectable } from '@angular/core';
import { Team } from './team';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class TeamService {

  private teamUrl = environment.serviceURL +' teams';  // URL to web api

  constructor(private http: HttpClient) { }

  getTeamByIds (teamIds:number[]): Observable<Team[]> {
    const url = `${this.teamUrl}`;
    return this.http.post(url, teamIds, httpOptions).pipe(
      tap((newTeams: Team[]) => console.log(`fetched teams`)),
      catchError(this.handleError<Team[]>(`fetchec teams`))
    );
  }

  /** GET game by id. Will 404 if id not found */
  getTeam (id: number): Observable<Team> {
    const url = `${this.teamUrl}/${id}`;
    return this.http.get<Team>(url).pipe(
        tap(_ => console.log(`fetched team team=${id}`)),
        catchError(this.handleError<Team>(`fetched team team=${id}`))
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