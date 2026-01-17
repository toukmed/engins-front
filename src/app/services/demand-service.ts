import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { Utils } from '../utils/Utils';
import { Demand } from '../models/demand';

@Injectable({
  providedIn: 'root',
})
export class DemandService {

  private apiUrl = Utils.getUrl()+'/api/v1/demandes';

  constructor(private http: HttpClient) { }

  createDemand(body: FormGroup): Observable<Demand[]> {
    return this.http.post<Demand[]>(this.apiUrl + '/create', body);
  }

  listDemands(body: any): Observable<Demand[]> {
    return this.http.post<Demand[]>(this.apiUrl, body);
  }

  updateDemand(body: FormGroup): Observable<Demand[]> {
    return this.http.post<Demand[]>(this.apiUrl + '/update', body);
  }

  acceptDemand(param: number): Observable<Demand[]> {
    return this.http.post<Demand[]>(this.apiUrl + '/accept/'+ param, {});
  }

  declineDemand(param: number): Observable<Demand[]> {
    return this.http.post<Demand[]>(this.apiUrl + '/decline/'+ param, {});
  }

}

