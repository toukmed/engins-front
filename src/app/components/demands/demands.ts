import { ChangeDetectorRef, Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DemandService } from '../../services/demand-service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-demands',
  imports: [
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    MatChipsModule,
    DatePipe,
  ],
  templateUrl: './demands.html',
  styleUrl: './demands.scss',
})
export class Demands implements OnInit, AfterViewInit {

  displayedColumns: string[] = [
    'nomComplet',
    'duration',
    'equipement',
    'nomEntreprise',
    'telephone',
    'ville',
    'message',
    'status',
    'dateCreation',
    'actions',
  ];

  dataSource = new MatTableDataSource<any>([]);
  selectedStatus = '';

  statusList = [
    { value: 'EN ATTENTE', label: 'En attente', color: '#ff9800' },
    { value: 'EN COURS', label: 'En cours', color: '#2196F3' },
    { value: 'VALIDE', label: 'Validé', color: '#4CAF50' },
    { value: 'TRAITE', label: 'Traité', color: '#8BC34A' },
    { value: 'REFUS', label: 'Refusé', color: '#f44336' },
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private demandService: DemandService,
    private cd: ChangeDetectorRef,
  ) {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      if (!filter) return true;
      return data.status === filter;
    };
  }

  ngOnInit(): void {
    this.loadDemands();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadDemands() {
    this.demandService.listDemands({}).subscribe(demands => {
      this.dataSource.data = demands;
      this.cd.detectChanges();
    });
  }

  onStatusFilter(status: string) {
    this.selectedStatus = status;
    this.dataSource.filter = status;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  acceptDemand(element: any) {
    this.demandService.acceptDemand(element.id).subscribe(() => {
      this.loadDemands();
    });
  }

  declineDemand(element: any) {
    this.demandService.declineDemand(element.id).subscribe(() => {
      this.loadDemands();
    });
  }

  getStatusBgColor(status: string): string {
    switch (status) {
        case 'En attente':
            return '#ff9800';
        case 'En cours':
            return '#2196F3';
        case 'Validé':
            return '#4CAF50';
        case 'Traité':
            return '#8BC34A';
        case 'Refusé':
            return '#f44336';
        default:
            return '#9e9e9e';
    }
  }

  getDays(dateFin: Date, dateDebut: Date): number {
    const end = new Date(dateFin).getTime();
    const start = new Date(dateDebut).getTime();
    return end - start;
  }
}
