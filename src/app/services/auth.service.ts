import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${environment.login}/login`, { email, password }).pipe(
      tap(() => this.loggedIn.next(true)),
      catchError(this.handleError)
    );
  }

  logout(): void {
    // Aquí puedes agregar la lógica para cerrar sesión, como limpiar tokens, etc.
    this.loggedIn.next(false);
    localStorage.removeItem('currentUser'); // Limpiar el usuario actual del almacenamiento local si es necesario
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error en el servidor.';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // El backend devolvió un código de error
      errorMessage = `Error ${error.status}: ${error.error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
