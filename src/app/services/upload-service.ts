import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Utils } from '../utils/Utils';

@Injectable({
  providedIn: 'root',
})
export class UploadService {

  private apiUrl = Utils.getUrl() + '/api/v1/uploads';

  constructor(private http: HttpClient) { }

  uploadImage(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/upload`, formData);
  }

}
