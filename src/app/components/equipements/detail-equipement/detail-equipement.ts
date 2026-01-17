import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EquipementService } from '../../../services/equipement-service';
import { Router } from '@angular/router';
import { Equipement } from '../../../models/equipement';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DecimalPipe } from '@angular/common';
import { Clipboard } from '@angular/cdk/clipboard';
import { Utils } from '../../../utils/Utils';
import { MatDialog } from '@angular/material/dialog';
import { DevisDemand } from '../../demands/devis-demand/devis-demand';
import { AddEditEquipement } from '../add-edit-equipement/add-edit-equipement';
import { SnackBarService } from '../../../services/snackbar-service';

@Component({
  selector: 'app-detail-equipement',
  imports: [
    MatCardModule, MatIconModule, MatButtonModule, MatTabsModule,
    MatDividerModule, MatChipsModule, MatTooltipModule,
    MatProgressSpinnerModule, DecimalPipe
  ],
  templateUrl: './detail-equipement.html',
  styleUrl: './detail-equipement.scss',
})
export class DetailEquipement implements OnInit {

  equipement: Equipement | null = null;
  isLoading = true;
  errorMessage = '';
  imageSrc = '';
  equipmentImages: string[] = [];
  activeTabIndex = 0;

  technicalSpecs: { icon: string; label: string; value: string }[] = [];
  physicalSpecs: { icon: string; label: string; value: string }[] = [];

  constructor(
    private equipementService: EquipementService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private dialog: MatDialog,
    private clipboard: Clipboard,
    private snackBar: SnackBarService
  ) {}

  ngOnInit(): void {
    this.loadEquipement();
  }

  private loadEquipement(): void {
    const equipementId = this.router.url.split('/').pop();
    if (!equipementId || isNaN(+equipementId)) {
      this.errorMessage = 'Identifiant d\'équipement invalide.';
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.equipementService.getEquipementById(+equipementId).subscribe({
      next: (data) => {
        this.equipement = data;
        this.imageSrc = Utils.getResourceUrl(data.imageUrl || '');
        this.equipmentImages = [this.imageSrc];
        this.buildSpecs();
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les détails de l\'équipement.';
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  private buildSpecs(): void {
    const eq = this.equipement as any;
    this.technicalSpecs = [
      { icon: 'bolt', label: 'Puissance moteur', value: eq?.enginePower ?? 'N/A' },
      { icon: 'inventory_2', label: 'Capacité', value: eq?.capacity ?? 'N/A' },
      { icon: 'speed', label: 'Kilométrage / Heures', value: eq?.usageHours ?? 'N/A' },
      { icon: 'local_gas_station', label: 'Type de carburant', value: eq?.fuelType ?? 'Diesel' },
      { icon: 'calendar_month', label: 'Année', value: eq?.year ?? 'N/A' },
    ];
    this.physicalSpecs = [
      { icon: 'fitness_center', label: 'Poids', value: eq?.weight ?? 'N/A' },
      { icon: 'straighten', label: 'Dimensions (L×l×H)', value: eq?.dimensions ?? 'N/A' },
      { icon: 'palette', label: 'Couleur', value: this.equipement?.description?.match(/couleur:\s*([\w-]+)/i)?.[1] ?? 'N/A' },
      { icon: 'verified', label: 'État', value: eq?.condition ?? 'Bon' },
    ];
  }

  setMainImage(imageUrl: string): void {
    this.imageSrc = imageUrl;
  }

  goBack(): void {
    this.router.navigate(['/equipements']);
  }

  demanderDevis(): void {
    const dialogRef = this.dialog.open(DevisDemand, {
      width: '1000px',
      data: { equipement: this.equipement }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadEquipement();
      }
    });
  }

  editEquipement(): void {
    const dialogRef = this.dialog.open(AddEditEquipement, {
      width: '1000px',
      disableClose: false,
      data: { isEdit: true, equipement: this.equipement }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadEquipement();
      }
    });
  }

  shareEquipement(): void {
    const url = window.location.href;
    this.clipboard.copy(url);
    this.snackBar.openSnackBar('Lien copié dans le presse-papiers', true);
  }

  retry(): void {
    this.loadEquipement();
  }
}
