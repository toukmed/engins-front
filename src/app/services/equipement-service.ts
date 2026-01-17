import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Equipement } from '../models/equipement';
import { FormGroup } from '@angular/forms';
import { Utils } from '../utils/Utils';

@Injectable({
  providedIn: 'root',
})
export class EquipementService {

  private apiUrl = Utils.getUrl()+'/api/v1/equipements';

  constructor(private http: HttpClient) { }

  getEquipements(body: any): Observable<Equipement[]> {
    return this.http.post<Equipement[]>(this.apiUrl, body);
  }

  createEquipement(body: FormGroup): Observable<Equipement[]> {
    return this.http.post<Equipement[]>(this.apiUrl + '/create', body);
  }

  editEquipement(id: number, body: FormGroup): Observable<Equipement[]> {
    return this.http.post<Equipement[]>(this.apiUrl + '/edit/' + id, body);
  }

  getEquipementById(id: number): Observable<Equipement> {
    return this.http.get<Equipement>(this.apiUrl + '/' + id);
  }

}

