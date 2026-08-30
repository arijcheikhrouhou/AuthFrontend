import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  username = '';
  email = '';
  roles = '';
  isAdmin = false;

  constructor(
    public authService: Auth,
    public router: Router,
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

  private applyUser(user: { username: string; email: string; roles: string[] }): void {
    this.username = user.username;
    this.email = user.email;
    this.roles = user.roles.join(', ');
    this.isAdmin = user.roles.includes('ROLE_ADMIN');
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
