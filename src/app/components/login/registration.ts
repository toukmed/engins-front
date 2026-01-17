import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth-service';
import { SnackBarService } from '../../services/snackbar-service';

@Component({
  selector: 'app-registration',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './registration.html',
  styleUrl: './registration.scss',
})
export class Registration {
  registerForm: FormGroup;
  hidePassword = signal(true);
  hideConfirm = signal(true);
  loading = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBarService: SnackBarService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        nom: ['', [Validators.required]],
        prenom: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const { confirmPassword, ...userData } = this.registerForm.value;
    this.authService.register(userData).subscribe({
      next: () => {
        this.loading.set(false);
        this.snackBarService.openSnackBar('Compte créé avec succès', true);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading.set(false);
        const message = err.error?.message || 'Erreur lors de la création du compte';
        this.snackBarService.openSnackBar(message, false);
      },
    });
  }
}
