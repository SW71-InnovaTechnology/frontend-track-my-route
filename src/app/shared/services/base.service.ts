import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { catchError, Observable, retry, throwError } from 'rxjs';
import {environment} from "../../../environments/enviroment";

@Injectable({
  providedIn: 'root'
})

export class BaseService<T> {
  basePath: string = `${environment.serverBasePath}`;
  resourceEndpoint: string = '/resource';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-type': 'application/json',
    })
  }

  constructor(protected http: HttpClient) {}

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Default error handling
      console.log(`An error occurred ${error.error.message}`);
    } else {
      // Unsuccessful Response Error Code returned from backend
      console.log(`Backend returned code ${error.status}, body was ${error.error}`);
    }
    return throwError(() => new Error('Something happened with request, please try again later'));
  }

  // Build Resource Path
  private resourcePath() {
    return `${this.basePath}${this.resourceEndpoint}`;
  }
  // Create resource
  create(item: any): Observable<T> {
    return this.http.post<T>(this.resourcePath(), JSON.stringify(item), this.httpOptions)
        .pipe(retry(2), catchError(this.handleError));
  }

  // Delete resource
  delete(id: any) {
    return this.http.delete(`${this.resourcePath()}/${id}`, this.httpOptions)
        .pipe(retry(2), catchError(this.handleError));
  }

  // Update Resource
  update(id: any, item: any): Observable<T> {
    return this.http.put<T>(`${this.resourcePath()}/${id}`, JSON.stringify(item), this.httpOptions)
        .pipe(retry(2), catchError(this.handleError));
  }

  // Get All
  getAll(): Observable<T> {
    return this.http.get<T>(this.resourcePath(), this.httpOptions)
        .pipe(retry(2), catchError(this.handleError));
  }

}