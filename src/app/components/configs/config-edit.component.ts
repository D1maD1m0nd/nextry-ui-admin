import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { GenerationConfigService } from '../../services/generation-config.service';
import { GenerationConfigDetail } from '../../models/generation-config-detail.interface';
import { open } from '@tauri-apps/plugin-dialog';
import { readTextFile } from '@tauri-apps/plugin-fs';

@Component({
  selector: 'app-config-edit',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    NgxJsonViewerModule
  ],
  template: `
    <div class="config-edit-container">
      <mat-card class="config-edit-card">
        <mat-card-header>
          <mat-card-title>{{ config?.configName }}</mat-card-title>
          <div class="header-actions">
            <button mat-icon-button color="primary" matTooltip="Загрузить JSON" (click)="loadJsonFile()">
              <mat-icon>upload_file</mat-icon>
            </button>
            <button mat-icon-button color="primary" matTooltip="{{ isVisible ? 'Скрыть JSON' : 'Показать JSON' }}" (click)="toggleVisibility()">
              <mat-icon>{{ isVisible ? 'visibility' : 'visibility_off' }}</mat-icon>
            </button>
            <button mat-icon-button (click)="close()">
              <mat-icon>close</mat-icon>
            </button>
          </div>
        </mat-card-header>
        
        <mat-card-content>
          <div class="json-header">
            <h3>Конфигурация </h3>
            <div class="json-actions">
              <button mat-icon-button color="primary" matTooltip="{{ isExpanded ? 'Свернуть JSON' : 'Развернуть JSON' }}" (click)="toggleExpand()">
                <mat-icon>{{ isExpanded ? 'unfold_less' : 'unfold_more' }}</mat-icon>
              </button>
              <button mat-icon-button color="primary" matTooltip="Копировать JSON" (click)="copyConfig()">
                <mat-icon>content_copy</mat-icon>
              </button>
            </div>
          </div>
          <div class="json-viewer-wrapper" [class.hidden]="!isVisible">
            <div class="json-viewer-container">
              <ngx-json-viewer [json]="config?.config" [expanded]="isExpanded"></ngx-json-viewer>
            </div>
          </div>
        </mat-card-content>

        <mat-card-actions align="end">
          <button mat-button color="warn" (click)="close()">Закрыть</button>
          <button mat-raised-button color="primary" (click)="save()">Сохранить</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .config-edit-container {
      padding: 1rem;
      height: 100%;
      overflow: auto;
    }

    .config-edit-card {
      background-color: #242424;
      border: 1px solid #333;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    mat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid #333;
      flex-shrink: 0;
    }

    .header-actions {
      display: flex;
      gap: 0.5rem;
    }

    mat-card-title {
      color: #fff;
      font-size: 1.5rem;
      font-weight: 500;
    }

    mat-card-content {
      padding: 1rem;
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .json-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      flex-shrink: 0;
    }

    .json-header h3 {
      margin: 0;
      color: #fff;
      font-size: 1.2rem;
      font-weight: 500;
    }

    .json-actions {
      display: flex;
      gap: 0.5rem;
    }

    .json-viewer-wrapper {
      flex: 1;
      transition: all 0.3s ease-in-out;
      overflow: hidden;
    }

    .json-viewer-wrapper.hidden {
      flex: 0;
      opacity: 0;
      margin: 0;
      padding: 0;
    }

    .json-viewer-container {
      background-color: #1a1a1a;
      border-radius: 4px;
      padding: 1rem;
      margin: 1rem 0;
      height: 100%;
      overflow: auto;
    }

    .json-viewer-container::-webkit-scrollbar {
      width: 8px;
    }

    .json-viewer-container::-webkit-scrollbar-track {
      background: #1a1a1a;
      border-radius: 4px;
    }

    .json-viewer-container::-webkit-scrollbar-thumb {
      background: #333;
      border-radius: 4px;
    }

    .json-viewer-container::-webkit-scrollbar-thumb:hover {
      background: #444;
    }

    mat-card-actions {
      padding: 1rem;
      border-top: 1px solid #333;
      flex-shrink: 0;
    }

    button {
      margin-left: 0.5rem;
    }

    ::ng-deep .ngx-json-viewer {
      background-color: transparent !important;
      color: #fff !important;
    }

    ::ng-deep .ngx-json-viewer .segment {
      color: #fff !important;
    }

    ::ng-deep .ngx-json-viewer .key {
      color: #3b82f6 !important;
    }

    ::ng-deep .ngx-json-viewer .string {
      color: #10b981 !important;
    }

    ::ng-deep .ngx-json-viewer .number {
      color: #f59e0b !important;
    }

    ::ng-deep .ngx-json-viewer .boolean {
      color: #ef4444 !important;
    }

    ::ng-deep .ngx-json-viewer .null {
      color: #6b7280 !important;
    }
  `]
})
export class ConfigEditComponent implements OnInit {
  config: GenerationConfigDetail | null = null;
  isExpanded = true;
  isVisible = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private configService: GenerationConfigService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadConfig(id);
    }
  }

  private loadConfig(id: string): void {
    console.log('Fetching config details for ID:', id);
    this.configService.getConfigById(id).subscribe({
      next: (config) => {
        console.log('Config details loaded:', {
          status: 'success',
          timestamp: new Date().toISOString(),
          data: config
        });
        this.config = config;
      },
      error: (error) => {
        console.error('Error loading config details:', {
          status: 'error',
          timestamp: new Date().toISOString(),
          error: error,
          message: error.message,
          statusCode: error.status
        });
      }
    });
  }

  async loadJsonFile(): Promise<void> {
    try {
      const selected = await open({
        multiple: false,
        filters: [{
          name: 'JSON',
          extensions: ['json']
        }],
        title: 'Выберите JSON файл конфигурации'
      });

      if (selected && typeof selected === 'string') {
        console.log('Selected file:', selected);
        const content = await readTextFile(selected);
        console.log('File content loaded');
        
        try {
          const jsonContent = JSON.parse(content);
          if (this.config) {
            this.config.config = jsonContent;
            console.log('JSON parsed successfully');
            this.isVisible = true; // Показываем JSON после загрузки
          }
        } catch (parseError) {
          console.error('Error parsing JSON file:', parseError);
          // TODO: Добавить уведомление об ошибке
        }
      }
    } catch (error) {
      console.error('Error loading JSON file:', error);
      // TODO: Добавить уведомление об ошибке
    }
  }

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }

  toggleVisibility(): void {
    this.isVisible = !this.isVisible;
  }

  copyConfig(): void {
    if (this.config) {
      const configString = JSON.stringify(this.config.config, null, 2);
      navigator.clipboard.writeText(configString).then(() => {
        console.log('Config copied to clipboard');
      }).catch(err => {
        console.error('Failed to copy config:', err);
      });
    }
  }

  save(): void {
    // TODO: Implement save functionality
    console.log('Save clicked');
  }

  close(): void {
    this.router.navigate(['/configs']);
  }
} 