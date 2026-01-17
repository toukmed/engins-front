import { Injectable } from '@angular/core';
import { DemandService } from './demand-service';
import { EquipementService } from './equipement-service';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Demand } from '../models/demand';
import { Equipement } from '../models/equipement';

export interface DashboardData {
  demands: Demand[];
  equipements: Equipement[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(
    private demandService: DemandService,
    private equipementService: EquipementService
  ) {}

  getDashboardData(): Observable<DashboardData> {
    return forkJoin({
      demands: this.demandService.listDemands({}),
      equipements: this.equipementService.getEquipements({})
    });
  }
}