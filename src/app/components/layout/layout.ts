import { Component, signal, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SidenavMenu } from '../sidenav-menu/sidenav-menu';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet,
    FormsModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    SidenavMenu],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  isSideNavOpen = signal(true);
  sideNavWidth = computed(() => this.isSideNavOpen() ? '240px' : '72px');

  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
