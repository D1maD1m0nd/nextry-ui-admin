import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="users-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Users Management</mat-card-title>
          <button mat-icon-button color="primary">
            <mat-icon>add</mat-icon>
          </button>
        </mat-card-header>
        <mat-card-content>
          <p>Users content will go here</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .users-container {
      height: 100%;
    }

    mat-card {
      height: 100%;
    }

    mat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `]
})
export class UsersComponent {} 