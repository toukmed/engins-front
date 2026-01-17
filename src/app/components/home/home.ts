import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DashboardService } from '../../services/dashboard-service';
import { Demand } from '../../models/demand';
import { Equipement } from '../../models/equipement';

interface MonthlyTurnover {
  month: string;
  year: number;
  total: number;
}

interface StatusCount {
  label: string;
  value: string;
  count: number;
  color: string;
}

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressBarModule,
    CurrencyPipe,
    DatePipe,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  demands = signal<Demand[]>([]);
  equipements = signal<Equipement[]>([]);

  // Equipment metrics
  totalEquipements = computed(() => this.equipements().length);
  availableEquipements = computed(() => this.equipements().filter(e => e.disponible).length);
  unavailableEquipements = computed(() => this.equipements().filter(e => !e.disponible).length);
  availabilityRate = computed(() =>
    this.totalEquipements() > 0
      ? Math.round((this.availableEquipements() / this.totalEquipements()) * 100)
      : 0
  );

  // Demand metrics
  totalDemands = computed(() => this.demands().length);
  statusCounts = computed<StatusCount[]>(() => {
    const statuses = [
      { value: 'En attente', label: 'En attente', color: '#ff9800' },
      { value: 'En cours', label: 'En cours', color: '#2196F3' },
      { value: 'Validé', label: 'Validé', color: '#4CAF50' },
      { value: 'Traité', label: 'Traité', color: '#8BC34A' },
      { value: 'Refusé', label: 'Refusé', color: '#f44336' },
    ];
    return statuses.map(s => ({
      ...s,
      count: this.demands().filter(d => (d as any).status === s.value).length
    }));
  });

  // Active rentals (En cours)
  activeRentals = computed(() =>
    this.demands().filter(d => (d as any).status === 'En cours')
  );

  // Upcoming expirations (ending within 7 days)
  expiringRentals = computed(() => {
    const now = new Date();
    return this.demands().filter(d => {
      if (!(d as any).dateFin) return false;
      const end = new Date((d as any).dateFin);
      const diff = (end.getTime() - now.getTime()) / (1000 * 3600 * 24);
      return diff >= 0 && diff <= 7 && (d as any).status === 'En cours';
    });
  });

  // Monthly turnover
  monthlyTurnover = computed<MonthlyTurnover[]>(() => {
    const map = new Map<string, MonthlyTurnover>();
    const monthNames = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    for (const d of this.demands()) {
      const demand = d as any;
      if (!demand.dateDebut || !demand.dateFin) continue;
      if (demand.status === 'Refusé') continue;

      const start = new Date(demand.dateDebut);
      const end = new Date(demand.dateFin);
      const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)));
      const price = (demand.equipementDto?.prixJournalier || 0) * days;

      const key = `${start.getFullYear()}-${start.getMonth()}`;
      const existing = map.get(key);
      if (existing) {
        existing.total += price;
      } else {
        map.set(key, {
          month: monthNames[start.getMonth()],
          year: start.getFullYear(),
          total: price
        });
      }
    }

    return Array.from(map.values())
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return monthNames.indexOf(a.month) - monthNames.indexOf(b.month);
      })
      .slice(-12); // last 12 months
  });

  maxTurnover = computed(() =>
    Math.max(...this.monthlyTurnover().map(m => m.total), 1)
  );

  // Categories breakdown
  categoriesBreakdown = computed(() => {
    const map = new Map<string, number>();
    for (const e of this.equipements()) {
      const cat = e.categorie || 'Non classé';
      map.set(cat, (map.get(cat) || 0) + 1);
    }
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  });

  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit() {
    this.dashboardService.getDashboardData().subscribe(({ demands, equipements }) => {
      this.demands.set(demands);
      this.equipements.set(equipements);
    });
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  getRentalDays(demand: any): number {
    if (!demand.dateDebut || !demand.dateFin) return 0;
    const start = new Date(demand.dateDebut).getTime();
    const end = new Date(demand.dateFin).getTime();
    return Math.max(1, Math.ceil((end - start) / (1000 * 3600 * 24)));
  }

  getRentalProgress(demand: any): number {
    if (!demand.dateDebut || !demand.dateFin) return 0;
    const start = new Date(demand.dateDebut).getTime();
    const end = new Date(demand.dateFin).getTime();
    const now = Date.now();
    if (now <= start) return 0;
    if (now >= end) return 100;
    return Math.round(((now - start) / (end - start)) * 100);
  }
}