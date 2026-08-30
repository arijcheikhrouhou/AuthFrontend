import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService, AdminUser } from '../admin.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin implements OnInit {
  users: AdminUser[] = [];
  loading = true;
  errorMessage = '';
  successMessage = '';

  constructor(
    private adminService: AdminService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.adminService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des utilisateurs.';
        this.loading = false;
        this.cdr.detectChanges();
        console.error(err);
      },
    });
  }

  isAdmin(user: AdminUser): boolean {
    return user.roles.includes('ROLE_ADMIN');
  }

  toggleAdminRole(user: AdminUser): void {
    const newRoles = this.isAdmin(user) ? ['ROLE_USER'] : ['ROLE_USER', 'ROLE_ADMIN'];

    this.adminService.updateRoles(user.id, newRoles).subscribe({
      next: (updated) => {
        user.roles = updated.roles;
        this.successMessage = `Rôles mis à jour pour ${user.username}.`;
        this.cdr.detectChanges();
        this.clearMessagesLater();
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la mise à jour des rôles.';
        console.error(err);
        this.cdr.detectChanges();
        this.clearMessagesLater();
      },
    });
  }

  toggleStatus(user: AdminUser): void {
    const newStatus = !user.enabled;

    this.adminService.updateStatus(user.id, newStatus).subscribe({
      next: (updated) => {
        user.enabled = updated.enabled;
        this.successMessage = `Compte ${user.username} ${newStatus ? 'activé' : 'désactivé'}.`;
        this.cdr.detectChanges();
        this.clearMessagesLater();
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du changement de statut.';
        console.error(err);
        this.cdr.detectChanges();
        this.clearMessagesLater();
      },
    });
  }

  deleteUser(user: AdminUser): void {
    const confirmed = confirm(
      `Supprimer définitivement le compte "${user.username}" ? Cette action est irréversible.`,
    );
    if (!confirmed) {
      return;
    }

    this.adminService.deleteUser(user.id).subscribe({
      next: () => {
        this.users = this.users.filter((u) => u.id !== user.id);
        this.successMessage = `Compte ${user.username} supprimé.`;
        this.cdr.detectChanges();
        this.clearMessagesLater();
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la suppression.';
        console.error(err);
        this.cdr.detectChanges();
        this.clearMessagesLater();
      },
    });
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  private clearMessagesLater(): void {
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
      this.cdr.detectChanges();
    }, 3000);
  }
}
