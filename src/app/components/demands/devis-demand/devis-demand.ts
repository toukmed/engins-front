import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { DemandService } from '../../../services/demand-service';
import { DemandNotificationService } from '../../../services/demand-notification-service';
import { SnackBarService } from '../../../services/snackbar-service';

@Component({
  selector: 'app-devis-demand',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './devis-demand.html',
  styleUrl: './devis-demand.scss',
})
export class DevisDemand implements OnInit {
  devisForm: FormGroup;
  minDate: Date;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DevisDemand>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private demandService: DemandService,
    private demandNotificationService: DemandNotificationService,
    private snackBarService: SnackBarService
  ) {

    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate() + 1);


    this.devisForm = this.fb.group({
      nomComplet: ['', [Validators.required, Validators.minLength(3)]],
      telephone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      ville: [''],
      nomEntreprise: [''],
      email: ['', Validators.email],
      idEquipement: [data?.equipementId || null],
      adresse: [''],
      message: ['']
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.devisForm.valid) {
      const formValue = this.devisForm.value;

      // set idEquipement from data if not set
      if (!formValue.idEquipement && this.data?.equipement?.id) {
        formValue.idEquipement = this.data.equipement.id;
      }
      if (formValue.status === undefined) {
        formValue.status = 'EN_ATTENTE';
      }
      console.log('Devis request:', formValue);
      // Call service to submit devis
      this.demandService.createDemand(formValue).subscribe({
        next: (response) => {
          this.demandNotificationService.notifyDemandCreated();
          this.dialogRef.close(response);
            this.snackBarService.openSnackBar('Demande créée avec succès pour la période: ' + formValue.dateDebut + ' - ' + formValue.dateFin, true);

        },
        error: (error) => {
          console.error('Error creating demand:', error);
          this.snackBarService.openSnackBar(error?.error?.message || 'Erreur lors de la création de la demande', false);
        }
      });
    } else {
      Object.keys(this.devisForm.controls).forEach(key => {
        this.devisForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}