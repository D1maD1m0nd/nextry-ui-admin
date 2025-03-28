import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NavigationComponent } from './components/navigation/navigation.component';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UpdateCheckerComponent } from './components/update-checker/update-checker.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    NavigationComponent,
    MatListModule,
    RouterLink,
    RouterLinkActive,
    UpdateCheckerComponent
  ],
  template: `
    <div class="app-container">
      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav #drawer class="sidenav" fixedInViewport
            [mode]="'side'"
            [opened]="true">
          <div class="logo-container">
            <img src="assets/angular.svg" alt="Angular Logo" class="angular-logo">
            <span class="logo-text">Nextry</span>
          </div>
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
              <mat-icon matListItemIcon>message</mat-icon>
              <span matListItemTitle>Ответы</span>
            </a>
            <a mat-list-item routerLink="/assets" routerLinkActive="active">
              <mat-icon matListItemIcon>image</mat-icon>
              <span matListItemTitle>Ассеты</span>
            </a>
            <a mat-list-item routerLink="/users" routerLinkActive="active">
              <mat-icon matListItemIcon>people</mat-icon>
              <span matListItemTitle>Пользователи</span>
            </a>
            <a mat-list-item routerLink="/prices" routerLinkActive="active">
              <mat-icon matListItemIcon>attach_money</mat-icon>
              <span matListItemTitle>Цены</span>
            </a>
          </mat-nav-list>
        </mat-sidenav>
        <mat-sidenav-content>
          <main class="content">
            <router-outlet></router-outlet>
          </main>
        </mat-sidenav-content>
      </mat-sidenav-container>
      <app-update-checker></app-update-checker>
    </div>
  `,
  styles: [`
    .app-container {
      height: 100vh;
      background-color: #1a1a1a;
      overflow: hidden;
    }

    .sidenav-container {
      height: 100vh;
      background-color: #1a1a1a;
      overflow: hidden;
    }

    .sidenav {
      width: auto;
      min-width: 7rem;
      background-color: #1a1a1a;
      border-right: 1px solid #333;
      overflow: hidden;
    }

    ::ng-deep .mat-drawer-inner-container {
      width: 100%;
      height: 100%;
      overflow: hidden !important;
      -webkit-overflow-scrolling: touch;
    }

    .logo-container {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      border-bottom: 1px solid #333;
      flex-shrink: 0;
    }

    .angular-logo {
      height: 2.5rem;
    }

    .logo-text {
      color: white;
      font-size: 1rem;
      font-weight: 500;
    }

    .content {
      height: 100vh;
      background-color: #1a1a1a;
      color: white;
      padding: 2rem;
      box-sizing: border-box;
      overflow: hidden;
    }

    ::ng-deep .mat-drawer-backdrop.mat-drawer-shown {
      background-color: rgba(0, 0, 0, 0.6);
    }

    ::ng-deep mat-sidenav-content {
      overflow: hidden !important;
    }

    .mat-nav-list {
      padding-top: 0;
    }

    .mat-list-item {
      color: #ffffff;
    }

    .mat-list-item:hover {
      background-color: #2a2a2a;
    }

    .active {
      background-color: #2a2a2a;
    }

    mat-icon {
      margin-right: 8px;
    }
  `]
})
export class AppComponent {
  title = 'nextry-ui-admin';
}
