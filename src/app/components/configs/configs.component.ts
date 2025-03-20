import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GenerationConfigService } from '../../services/generation-config.service';
import { GenerationConfig } from '../../models/generation-config.interface';

@Component({
  selector: 'app-configs',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule
  ],
  template: `
    <div class="configs-container">
      <div class="configs-grid">
        @for (config of configs; track config.id) {
          <mat-card class="config-card" (click)="editConfig(config.id)">
            <mat-card-content>
              <div class="config-header">
                <mat-icon class="config-icon">settings</mat-icon>
                <h3 class="config-name">{{config.configName}}</h3>
              </div>
              <div class="config-id">
                <mat-chip color="primary" selected>
                  ID: {{config.id}}
                </mat-chip>
              </div>
              <div class="config-actions">
                <button mat-icon-button color="primary" matTooltip="Редактировать" (click)="$event.stopPropagation(); editConfig(config.id)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" matTooltip="Удалить" (click)="$event.stopPropagation(); deleteConfig(config.id)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        }
      </div>
    </div>
  `,
  styles: [`
    .configs-container {
      padding: 1rem;
      height: 100%;
      overflow: auto;
    }

    .configs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
      padding: 1rem 0;
    }

    .config-card {
      background-color: #242424;
      border: 1px solid #333;
      transition: transform 0.2s ease-in-out;
      cursor: pointer;
    }

    .config-card:hover {
      transform: translateY(-4px);
    }

    .config-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .config-icon {
      color: #3b82f6;
    }

    .config-name {
      margin: 0;
      color: #fff;
      font-size: 1.1rem;
      font-weight: 500;
    }

    .config-id {
      margin-bottom: 1rem;
    }

    .config-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }

    mat-card-content {
      padding: 1rem;
    }

    mat-icon {
      color: #99a3ba;
    }

    button:hover mat-icon {
      color: #3b82f6;
    }

    button[color="warn"]:hover mat-icon {
      color: #ef4444;
    }
  `]
})
export class ConfigsComponent implements OnInit {
  configs: GenerationConfig[] = [];

  constructor(
    private configService: GenerationConfigService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadConfigs();
  }

  private loadConfigs(): void {
    console.log('Fetching generation configs from API...');
    this.configService.getConfigs().subscribe({
      next: (configs) => {
        console.log('API Response:', {
          status: 'success',
          timestamp: new Date().toISOString(),
          data: configs,
          count: configs.length
        });
        this.configs = configs;
      },
      error: (error) => {
        console.error('API Error:', {
          status: 'error',
          timestamp: new Date().toISOString(),
          error: error,
          message: error.message,
          statusCode: error.status
        });
      }
    });
  }

  editConfig(id: string): void {
    this.router.navigate(['/configs', id]);
  }

  deleteConfig(id: string): void {
    // TODO: Implement delete functionality
    console.log('Delete clicked for config:', id);
  }
} 