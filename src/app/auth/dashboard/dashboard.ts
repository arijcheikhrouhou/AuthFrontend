import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../auth';
import { MfaService } from '../mfa.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  username = '';
  email = '';
  roles = '';
  isAdmin = false;
  mfaEnabled = false;

  // MFA
  showMfaSetup = false;
  qrCodeImage = '';
  secret = '';
  mfaCode = '';
  mfaSuccessMessage = '';
  mfaErrorMessage = '';

  constructor(
    public authService: Auth,
    public router: Router,
    private mfaService: MfaService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const cachedUser = this.authService.getCurrentUser();
    if (cachedUser) {
      this.applyUser(cachedUser);
      return;
    }
    this.authService.fetchCurrentUser().subscribe({
      next: (user) => this.applyUser(user),
      error: () => this.router.navigate(['/login']),
    });
  }

  private applyUser(user: {
    username: string;
    email: string;
    roles: string[];
    mfaEnabled: boolean;
  }): void {
    this.username = user.username;
    this.email = user.email;
    this.roles = user.roles.join(', ');
    this.isAdmin = user.roles.includes('ROLE_ADMIN');
    this.mfaEnabled = user.mfaEnabled;
  }

  startMfaSetup(): void {
    this.mfaErrorMessage = '';
    this.mfaService.setup().subscribe({
      next: (res) => {
        this.qrCodeImage = res.qrCodeImage;
        this.secret = res.secret;
        this.showMfaSetup = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.mfaErrorMessage = err.error?.message || 'Erreur lors de la génération du QR code.';
        this.cdr.detectChanges();
      },
    });
  }

  confirmMfaEnable(): void {
    this.mfaErrorMessage = '';
    this.mfaService.enable(this.mfaCode).subscribe({
      next: () => {
        this.mfaSuccessMessage = 'MFA activé avec succès !';
        this.showMfaSetup = false;
        this.mfaCode = '';
        this.mfaEnabled = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.mfaErrorMessage = err.error?.message || 'Code invalide.';
        this.cdr.detectChanges();
      },
    });
  }

  disableMfa(): void {
    const confirmed = confirm('Désactiver la double authentification ?');
    if (!confirmed) return;

    this.mfaService.disable().subscribe({
      next: () => {
        this.mfaSuccessMessage = 'MFA désactivé.';
        this.showMfaSetup = false;
        this.mfaEnabled = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.mfaErrorMessage = 'Erreur lors de la désactivation.';
        this.cdr.detectChanges();
      },
    });
  }

  cancelMfaSetup(): void {
    this.showMfaSetup = false;
    this.qrCodeImage = '';
    this.secret = '';
    this.mfaCode = '';
  }

  goToAdmin(): void {
    this.router.navigate(['/admin']);
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login']),
    });
  }
}
