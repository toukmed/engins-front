import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DemandNotificationService {
  private demandCreatedSubject = new Subject<void>();
  demandCreated$ = this.demandCreatedSubject.asObservable();

  notifyDemandCreated(): void {
    this.demandCreatedSubject.next();
  }
}