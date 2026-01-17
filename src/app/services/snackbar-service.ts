import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {

  constructor(private snackBar: MatSnackBar) {
  }

  openSnackBar(message: string, isSuccess?: boolean): void {
    const panelClass = isSuccess ? 'snack-success' : (!isSuccess ? 'snack-error' : 'snack-default');
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: [panelClass]
    });
  }
}
