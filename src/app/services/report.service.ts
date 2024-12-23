import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private apiUrl = environment.report;
  private httpService = inject( HttpClient );

  constructor() { }

  public getReportData(): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpService.get<any>(`${this.apiUrl}/getReport`, { headers }).pipe(
      catchError((err: HttpErrorResponse) => {
        let msg = 'no se pudo obtener los reportes';
        if (err.status === 500 && err.error) {
          return throwError(() => new Error(msg));
        }
        return throwError(() => err);
      })
    );
  }

  public getReportAliado() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpService.get<any>(`${this.apiUrl}/reportAliado`,{headers}).pipe(
      catchError((err:HttpErrorResponse) => {
        let msg = 'no se pudo obtener los reportes';
        if (err.status === 500 && err.error) {
          return throwError(() => new Error(msg));
        }
        return throwError(() => err);
      })
    )
  }

  public deleteAliado(data:any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpService.post<any>(`${this.apiUrl}/deleteAliado`,data,{headers}).pipe(
      catchError((err:HttpErrorResponse) => {
        let msg = 'no se pudo eliminar el aliado';
        if (err.status === 500 && err.error) {
          return throwError(() => new Error(msg));
        }
        return throwError(() => err);
      })
    )
  }
}
