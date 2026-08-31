import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  username = '';
  password = '';
  errorMessage = '';

  mfaRequired = false;
  mfaCode = '';
  mfaError = '';

  constructor(
    private authService: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: (response: any) => {
        if (response && response.mfaRequired) {
          this.mfaRequired = true;
          this.cdr.detectChanges();
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Identifiants incorrects. Veuillez réessayer.';
        this.cdr.detectChanges();
        console.error(err);
      },
    });
  }

  onSubmitMfa(): void {
    this.mfaError = '';
    this.authService
      .login({ username: this.username, password: this.password, mfaCode: this.mfaCode })
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.mfaError = err.error?.message || 'Code invalide. Réessayez.';
          this.cdr.detectChanges();
          console.error(err);
        },
      });
  }

  cancelMfa(): void {
    this.mfaRequired = false;
    this.mfaCode = '';
    this.mfaError = '';
    this.cdr.detectChanges();
  }
}
