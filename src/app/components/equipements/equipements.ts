import { Component, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { EquipementService } from '../../services/equipement-service';
import { Equipement } from '../../models/equipement';
import { Router } from '@angular/router';
import { AddEditEquipement } from './add-edit-equipement/add-edit-equipement';
import { MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { Utils } from '../../utils/Utils';

@Component({
  selector: 'app-equipements',
  imports: [
    DecimalPipe,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule, MatChipsModule,
],
  templateUrl: './equipements.html',
  styleUrl: './equipements.scss',
})
export class Equipements implements OnInit{

  constructor(private matDialog: MatDialog, private equipementsService: EquipementService, private router: Router) {}
  ngOnInit(): void {
    this.listEquipements();
  }

  equipements = signal<Equipement[]>([]);

  listEquipements() {
    this.equipementsService.getEquipements({}).subscribe((data) => {
      this.equipements.set(data);
    });
  }

  addEquipement() {
    const dialogRef = this.matDialog.open(AddEditEquipement, {
      width: '1000px',
      disableClose: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.listEquipements();
      }
    });
  }

  editEquipement(equipement: Equipement) {
    console.log('Editing equipement:', equipement);
    const dialogRef = this.matDialog.open(AddEditEquipement, {
      width: '1000px',
      disableClose: false,
      data: { isEdit: true, equipement:equipement }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.listEquipements();
      }
    });
  }

  viewEquipementDetails(equipement: Equipement) {
    this.router.navigate(['/equipements', equipement.id]);
  }

  getEquipementImageUrl(imagePath: string): string {
    return Utils.getResourceUrl(imagePath);
  }

  onSearchInput(event: any) {
    const query = event.target.value.toLowerCase();
    if (query.length % 2 === 0) {
      this.equipementsService.getEquipements({ label: query }).subscribe((data) => {
        this.equipements.set(data);
      });
    }
  }
}
