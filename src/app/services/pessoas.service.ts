import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PessoasService {

  private urlEndPoint = `${environment.API_URL}/pessoa`;

  constructor(private http: HttpClient) { }

  save(pessoa: any) {
    return this.http.post(`${this.urlEndPoint}`, pessoa).pipe(
      catchError(e => {
        return throwError(e);
      })
    )
  }

  update(pessoa: any) {
    return this.http.put(`${this.urlEndPoint}`, pessoa).pipe(
      catchError(e => {
        return throwError(e);
      })
    )
  }

  findAll(page: number, rows: number): Observable<any[]> {
    let params: HttpParams = new HttpParams();
    params = params.append('page', page.toString())
    params = params.append('rows', rows.toString())

    return this.http.get<any[]>(`${this.urlEndPoint}`, {params: params}).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  filter(nome: string, cpf: string, email: string, nascimento: string) {
    let params: HttpParams = new HttpParams();
    
    if (nome) {
      params = params.append('nome', nome);
    }

    if (cpf) {
      params = params.append('cpf', cpf);
    }

    if (email) {
      params = params.append('email', email);
    }

    if (nascimento) {
      params = params.append('nascimento', nascimento);
    }

    return this.http.get<any[]>(`${this.urlEndPoint}/filtro`, { params: params }).pipe(
      catchError(e => {
        return throwError(e);
      })
    )
  }

  delete(id: number) {
    return this.http.delete(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

}
