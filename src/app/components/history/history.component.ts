import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { HistoryGenerationService } from '../../services/history-generation.service';
import { HistoryGeneration } from '../../models/history-generation.interface';
import { SortEnum } from '../../models/sort.enum';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule
  ],
  template: `
    <div class="history-container">
      <div class="history-header">
        <mat-form-field class="sort-field">
          <mat-label>Сортировка</mat-label>
          <mat-select [(ngModel)]="currentSort" (selectionChange)="onSortChange()">
            <mat-option [value]="SortEnum.DESC">Сначала новые</mat-option>
            <mat-option [value]="SortEnum.ASC">Сначала старые</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="history-grid">
        @for (item of history; track item.id) {
          <mat-card class="history-card">
            <mat-card-content>
              <div class="history-header">
                <div class="user-info">
                  <mat-icon class="user-icon">person</mat-icon>
                  <div class="user-details">
                    <h3 class="user-name">{{item.user.name}}</h3>
                    <p class="user-email">{{item.user.email}}</p>
                  </div>
                </div>
                <div class="generation-type">
                  <mat-chip color="primary" selected>
                    {{item.generationType}}
                  </mat-chip>
                </div>
              </div>

              <div class="images-container">
                <div class="image-wrapper">
                  @if (item.stockUrl) {
                    <img [src]="item.stockUrl" alt="Stock" class="generation-image" (error)="onImageError($event, 'stock')">
                  } @else {
                    <div class="image-fallback">
                      <mat-icon>image_not_supported</mat-icon>
                      <span>Изображение отсутствует</span>
                    </div>
                  }
                  <div class="image-label">Исходное изображение</div>
                </div>
                <div class="image-wrapper">
                  @if (item.previewUrl) {
                    <img [src]="item.previewUrl" alt="Preview" class="generation-image" (error)="onImageError($event, 'preview')">
                  } @else {
                    <div class="image-fallback">
                      <mat-icon>image_not_supported</mat-icon>
                      <span>Изображение отсутствует</span>
                    </div>
                  }
                  <div class="image-label">Результат</div>
                </div>
              </div>

              <div class="history-footer">
                <div class="date-info">
                  <mat-icon class="date-icon">schedule</mat-icon>
                  <span>{{item.createdAt | date:'dd.MM.yyyy HH:mm'}}</span>
                </div>
                <div class="status-info">
                  <mat-chip [color]="getStatusColor(item.status)" selected>
                    {{item.status || 'В обработке'}}
                  </mat-chip>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        }
      </div>
    </div>
  `,
  styles: [`
    .history-container {
      padding: 1rem;
      height: 100%;
      overflow: auto;
    }

    .history-header {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 1rem;
    }

    .sort-field {
      width: 200px;
    }

    .history-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 1rem;
      padding: 1rem 0;
    }

    .history-card {
      background-color: #242424;
      border: 1px solid #333;
      transition: transform 0.2s ease-in-out;
    }

    .history-card:hover {
      transform: translateY(-4px);
    }

    .history-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .user-icon {
      color: #3b82f6;
    }

    .user-details {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      margin: 0;
      color: #fff;
      font-size: 1.1rem;
      font-weight: 500;
    }

    .user-email {
      margin: 0;
      color: #99a3ba;
      font-size: 0.9rem;
    }

    .images-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin: 1rem 0;
    }

    .image-wrapper {
      position: relative;
      aspect-ratio: 1;
      border-radius: 4px;
      overflow: hidden;
      background-color: #1a1a1a;
    }

    .generation-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .image-fallback {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #666;
      gap: 0.5rem;
      padding: 1rem;
      text-align: center;

      mat-icon {
        font-size: 3rem;
        width: 3rem;
        height: 3rem;
      }

      span {
        font-size: 0.9rem;
        color: #99a3ba;
      }
    }

    .image-label {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 0.5rem;
      background: rgba(0, 0, 0, 0.7);
      color: #fff;
      font-size: 0.9rem;
      text-align: center;
    }

    .history-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;
    }

    .date-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #99a3ba;
    }

    .date-icon {
      font-size: 1.2rem;
    }

    .status-info {
      display: flex;
      gap: 0.5rem;
    }

    mat-card-content {
      padding: 1rem;
    }

    ::ng-deep {
      .mat-mdc-form-field {
        .mat-mdc-text-field-wrapper {
          background-color: #242424;
          border: 1px solid #333;
        }

        .mat-mdc-form-field-label {
          color: #99a3ba;
        }

        .mat-mdc-select-value {
          color: #fff;
        }

        .mat-mdc-select-arrow {
          color: #99a3ba;
        }

        .mat-mdc-option {
          color: #fff;
          background-color: #242424;

          &:hover {
            background-color: #333;
          }
        }
      }
    }
  `]
})
export class HistoryComponent implements OnInit {
  history: HistoryGeneration[] = [];
  currentSort = SortEnum.DESC;
  protected readonly SortEnum = SortEnum;

  constructor(private historyService: HistoryGenerationService) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  onSortChange(): void {
    this.loadHistory();
  }

  onImageError(event: Event, type: 'stock' | 'preview'): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    const wrapper = img.parentElement;
    if (wrapper) {
      const fallback = document.createElement('div');
      fallback.className = 'image-fallback';
      fallback.innerHTML = `
        <mat-icon>image_not_supported</mat-icon>
        <span>Изображение отсутствует</span>
      `;
      wrapper.appendChild(fallback);
    }
  }

  private loadHistory(): void {
    console.log('Fetching history from API...', { sort: this.currentSort });
    this.historyService.getHistory(this.currentSort).subscribe({
      next: (history) => {
        console.log('History loaded:', {
          status: 'success',
          timestamp: new Date().toISOString(),
          data: history,
          count: history.length,
          sort: this.currentSort
        });
        this.history = history;
      },
      error: (error) => {
        console.error('Error loading history:', {
          status: 'error',
          timestamp: new Date().toISOString(),
          error: error,
          message: error.message,
          statusCode: error.status,
          sort: this.currentSort
        });
      }
    });
  }

  getStatusColor(status: string | null): string {
    switch (status?.toLowerCase()) {
      case 'complete':
        return 'primary';
      case 'error':
        return 'warn';
      case 'processing':
        return 'accent';
      default:
        return 'primary';
    }
  }
} 