import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NavigationComponent } from './components/navigation/navigation.component';

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
    NavigationComponent
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
          <app-navigation></app-navigation>
        </mat-sidenav>
        <mat-sidenav-content>
          <main class="content">
            <router-outlet></router-outlet>
          </main>
        </mat-sidenav-content>
      </mat-sidenav-container>
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
  `]
})
export class AppComponent {
  title = 'nextry-ui-admin';
}
