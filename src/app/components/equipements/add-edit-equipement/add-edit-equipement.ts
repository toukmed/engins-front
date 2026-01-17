import { Component, Inject, OnInit, signal, Signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UploadService } from '../../../services/upload-service';
import { EquipementService } from '../../../services/equipement-service';
import { SnackBarService } from '../../../services/snackbar-service';

@Component({
  selector: 'app-add-edit-equipement',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatDialogModule
  ],
  templateUrl: './add-edit-equipement.html',
  styleUrl: './add-edit-equipement.scss',
})
export class AddEditEquipement implements OnInit {
  equipementForm: Signal<FormGroup>;
  imageUploadForm: Signal<FormGroup>;
  isEditMode: boolean = false;
  imagePreview: any | null = null;
  selectedImage: File | null = null;

  constructor(
    private fb: FormBuilder, 
    private uploadService: UploadService,
    private equipementService: EquipementService,
    private dialogRef: MatDialogRef<AddEditEquipement>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private snackBarService: SnackBarService
  ) {

    this.isEditMode =  data && data.isEdit || false;

    this.equipementForm = signal(this.fb.group({
      marque: ['', Validators.required],
      model: ['', Validators.required],
      matricule: ['', Validators.required],
      prixJournalier: [0, [Validators.required, Validators.min(0)]],
      ville: ['', Validators.required],
      // pays: ['', Validators.required],
      categorie: ['', Validators.required],
      idProprietaire: ['', Validators.required],
      description: [''],
      imageUrl: [''],
      disponible: [false]
    }));
    this.imageUploadForm = signal(this.fb.group({
      file: [null, Validators.required]
    }));
  }

  ngOnInit(): void {
    if (this.isEditMode) {
      this.equipementForm().patchValue(this.data.equipement);
    }
  }

  onSubmit(): void {
    if (this.equipementForm().valid) {
      if (this.selectedImage) {
        const formData = new FormData();
        formData.append('file', this.selectedImage);

        this.uploadService.uploadImage(formData).subscribe({
          next: (res) => {
            console.log('Image uploaded:', res);
            this.equipementForm().get('imageUrl')?.setValue(res);
          },
          error: (err) => {
            console.error('Upload failed:', err);
            this.snackBarService.openSnackBar(err?.error?.message || 'Failed to upload image. Please try again.', false);
          }
        });
      }

      const formValue = this.equipementForm().value;
      if (this.isEditMode) {
        this.equipementService.editEquipement(this.data.equipement.id, formValue).subscribe({
          next: (data) => {
            this.dialogRef.close(true);
            this.snackBarService.openSnackBar('Équipement mis à jour avec succès.', true);
          },
          error: (err) => {
            console.error('Failed to update equipment:', err);
            this.snackBarService.openSnackBar(err?.error?.message || 'Erreur lors de la mise à jour de l\'équipement.', false);
          }
        });
      } else {
        this.equipementService.createEquipement(formValue).subscribe({
          next: (data) => {
            this.dialogRef.close(true);
            this.snackBarService.openSnackBar('Équipement créé avec succès.', true);
          },
          error: (err) => {
            console.error('Failed to create equipment:', err);
            this.snackBarService.openSnackBar(err?.error?.message || 'Erreur lors de la création de l\'équipement.', false);
          }
        });
      }
    }
  }
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('Only JPG, JPEG, or PNG files are allowed.');
        return;
      }

      this.selectedImage = file;

      // Read the file for preview
      const reader = new FileReader();
      reader.onload = () => {
        console.log("File onload......");
        this.imagePreview = reader.result as string;
        // Copy the image path to imageUrl (assuming the file is manually placed in src/assets)
        this.equipementForm().get('imageUrl')?.setValue(file.name);
      };
      reader.readAsDataURL(file);
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
