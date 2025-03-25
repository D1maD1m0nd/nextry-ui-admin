import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule, MatTooltipModule],
  template: `
    <mat-nav-list>
      <a mat-list-item routerLink="/configs" routerLinkActive="active">
        <mat-icon matListItemIcon>settings</mat-icon>
        <span matListItemTitle>Конфигурации</span>
      </a>
      <a mat-list-item routerLink="/history" routerLinkActive="active">
        <mat-icon matListItemIcon>history</mat-icon>
        <span matListItemTitle>История</span>
      </a>
      <a mat-list-item routerLink="/responses" routerLinkActive="active">
        <mat-icon matListItemIcon>chat</mat-icon>
        <span matListItemTitle>Ответы</span>
      </a>
      <a mat-list-item routerLink="/users" routerLinkActive="active">
        <mat-icon matListItemIcon>people</mat-icon>
        <span matListItemTitle>Пользователи</span>
      </a>
    </mat-nav-list>
  `,
  styles: [`
    mat-nav-list {
      padding: 0;
    }

    a {
      color: #99a3ba;
      text-decoration: none;
      display: flex;
      align-items: center;
      padding: 0.75rem 1rem;
      transition: background-color 0.2s ease-in-out;
    }

    a:hover {
      background-color: rgba(255, 255, 255, 0.05);
    }

    a.active {
      background-color: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
    }

    mat-icon {
      margin-right: 0.75rem;
    }
  `]
})
export class NavigationComponent {} 