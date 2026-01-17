import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { DemandService } from '../../services/demand-service';
import { DemandNotificationService } from '../../services/demand-notification-service';

export type SidenavMenuProps = {
  icon?: string;
  label?: string;
  route?: string;
};

@Component({
  selector: 'app-sidenav-menu',
  imports: [CommonModule, MatIconModule, RouterModule, MatBadgeModule],
  templateUrl: './sidenav-menu.html',
  styleUrl: './sidenav-menu.scss',
})
export class SidenavMenu {
  sideNavOpen = signal(true);

  demandsCount = signal(0);

  @Input() set isSideNavOpen(val: boolean) {
    this.sideNavOpen.set(val)
  }

  constructor(
    private demandService: DemandService, 
    private demandNotificationService: DemandNotificationService
  ) {
    // For demo purposes, set a static number of demands
    this.demandNotificationService.demandCreated$.subscribe(() => {
      this.loadDemandsCount();
    });
    this.loadDemandsCount();
  }

  loadDemandsCount() {
    this.demandService.listDemands({}).subscribe(demands => {
      this.demandsCount.set(demands.length);
    });

    // In a real application, you might fetch this from the server
    // this.demandService.getDemandsCount().subscribe(count => {
    //   this.demandsCount.set(count);
    // });
  }

  menuItems = signal<SidenavMenuProps[]>([
    { icon: 'home', label: 'Acceuil', route: '/home' },
    { icon: 'build', label: 'Equipements', route: '/equipements' },
    { icon: 'assignment', label: 'Demandes', route: '/demands' },
    { icon: 'people', label: 'Utilisateurs', route: '/users' },
  ]);
}
