import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { AssetsService } from '../../services/assets.service';
import { ImagePreviewDialogComponent } from './image-preview-dialog/image-preview-dialog.component';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';

interface Asset {
  id: string;
  url: string;
  name: string;
}

@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSnackBarModule,
    FormsModule
  ],
  template: `
    <div class="assets-container">
      <div class="assets-header">
        <h1>Ассеты</h1>
        <div class="header-actions">
          <mat-form-field appearance="outline" class="folder-select">
            <mat-label>Выберите папку</mat-label>
            <mat-select [(ngModel)]="selectedFolder" (selectionChange)="onFolderChange()">
              @for (folder of folders; track folder) {
                <mat-option [value]="folder">{{ folder }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
          <button mat-icon-button color="primary" matTooltip="Обновить" (click)="loadAssets()">
            <mat-icon>refresh</mat-icon>
          </button>
          <input
            type="file"
            #fileInput
            multiple
            accept="image/*"
            style="display: none"
            (change)="onFileSelected($event)"
          >
          <button mat-icon-button color="primary" matTooltip="Загрузить" (click)="fileInput.click()">
            <mat-icon>upload_file</mat-icon>
          </button>
        </div>
      </div>

      <div 
        class="assets-content"
        [class.drag-over]="isDragOver"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
      >
        @if (isLoading) {
          <div class="loading-container">
            <mat-spinner diameter="40"></mat-spinner>
          </div>
        } @else {
          <mat-grid-list cols="4" rowHeight="1:1" gutterSize="16">
            @for (asset of assets; track asset.id) {
              <mat-grid-tile>
                <mat-card class="asset-card">
                  <div class="image-container" (click)="openPreview(asset)">
                    @if (asset.url) {
                      <img [src]="asset.url" [alt]="asset.name" (error)="onImageError($event)">
                    } @else {
                      <div class="image-fallback">
                        <mat-icon>image_not_supported</mat-icon>
                        <span>Изображение отсутствует</span>
                      </div>
                    }
                  </div>
                  <mat-card-content>
                    <div class="asset-info">
                      <h3 class="asset-name">{{ asset.name }}</h3>
                    </div>
                  </mat-card-content>
                  <mat-card-actions>
                    <button mat-icon-button color="primary" matTooltip="Скачать" (click)="$event.stopPropagation(); onDownload(asset)">
                      <mat-icon>download</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" matTooltip="Удалить" (click)="$event.stopPropagation(); onDelete(asset)">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </mat-card-actions>
                </mat-card>
              </mat-grid-tile>
            }
          </mat-grid-list>
        }

        @if (isDragOver) {
          <div class="drag-overlay">
            <mat-icon>cloud_upload</mat-icon>
            <span>Отпустите файлы для загрузки</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .assets-container {
      padding: 1rem;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .assets-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding: 0 1rem;

      h1 {
        margin: 0;
        color: #fff;
        font-size: 1.5rem;
        font-weight: 500;
      }

      .header-actions {
        display: flex;
        gap: 0.5rem;
        align-items: center;
      }
    }

    .folder-select {
      width: 200px;
      margin-right: 1rem;
    }

    ::ng-deep .folder-select {
      .mat-mdc-form-field-flex {
        background-color: #242424;
      }

      .mat-mdc-text-field-wrapper {
        background-color: #242424;
        color: #fff;
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
        background-color: #242424;
        color: #fff;

        &:hover {
          background-color: #2a2a2a;
        }

        &.mat-mdc-selected {
          background-color: #2a2a2a;
        }
      }
    }

    .assets-content {
      flex: 1;
      overflow: auto;
      padding: 0 1rem;
      position: relative;
      transition: all 0.3s ease;

      &.drag-over {
        background-color: rgba(0, 0, 0, 0.5);
      }
    }

    .drag-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: rgba(0, 0, 0, 0.7);
      z-index: 1000;
      gap: 1rem;

      mat-icon {
        font-size: 4rem;
        width: 4rem;
        height: 4rem;
        color: #fff;
      }

      span {
        color: #fff;
        font-size: 1.2rem;
        font-weight: 500;
      }
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }

    .asset-card {
      width: 100%;
      height: 100%;
      background-color: #242424;
      border: 1px solid #333;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s ease-in-out;

      &:hover {
        transform: translateY(-2px);
      }
    }

    .image-container {
      flex: 1;
      position: relative;
      overflow: hidden;
      background-color: #1a1a1a;
      cursor: pointer;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
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

    mat-card-content {
      padding: 0.75rem;
      flex-shrink: 0;
    }

    .asset-info {
      .asset-name {
        margin: 0;
        color: #fff;
        font-size: 1rem;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    mat-card-actions {
      padding: 0.5rem;
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      border-top: 1px solid #333;
    }
  `]
})
export class AssetsComponent implements OnInit {
  assets: Asset[] = [];
  folders: string[] = [];
  selectedFolder: string = '';
  isLoading = true;
  isUploading = false;
  isDragOver = false;

  constructor(
    private assetsService: AssetsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadFolders();
  }

  private loadFolders(): void {
    this.isLoading = true;
    this.assetsService.getFolders().subscribe({
      next: (folders) => {
        this.folders = folders;
        if (folders.length > 0) {
          this.selectedFolder = folders[0];
          this.loadAssets();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading folders:', error);
        this.isLoading = false;
      }
    });
  }

  loadAssets(): void {
    if (!this.selectedFolder) return;
    
    this.isLoading = true;
    this.assetsService.getAssets(this.selectedFolder).subscribe({
      next: (urls) => {
        this.assets = urls.map(url => ({
          id: url.split('/').pop() || '',
          url: url,
          name: url.split('/').pop() || 'Без имени'
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading assets:', error);
        this.isLoading = false;
      }
    });
  }

  onFolderChange(): void {
    this.loadAssets();
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    const container = img.parentElement;
    if (container) {
      const fallback = document.createElement('div');
      fallback.className = 'image-fallback';
      fallback.innerHTML = `
        <mat-icon>image_not_supported</mat-icon>
        <span>Изображение отсутствует</span>
      `;
      container.appendChild(fallback);
    }
  }

  openPreview(asset: Asset): void {
    this.dialog.open(ImagePreviewDialogComponent, {
      data: {
        url: asset.url,
        name: asset.name
      },
      width: '80%',
      height: '80%',
      maxWidth: '1200px',
      maxHeight: '800px',
      panelClass: 'image-preview-dialog'
    });
  }

  onDownload(asset: Asset): void {
    window.open(asset.url, '_blank');
  }

  onDelete(asset: Asset): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Подтверждение удаления',
        message: `Вы уверены, что хотите удалить изображение "${asset.name}"?`,
        confirmText: 'Удалить',
        cancelText: 'Отмена'
      },
      width: '400px',
      panelClass: 'confirm-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.assetsService.deleteAsset(this.selectedFolder, asset.name).subscribe({
          next: () => {
            this.loadAssets(); // Перезагружаем список после удаления
          },
          error: (error) => {
            console.error('Error deleting asset:', error);
            this.isLoading = false;
          }
        });
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const files = Array.from(input.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
      this.snackBar.open('Пожалуйста, выберите только изображения', 'OK', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }

    this.uploadFiles(imageFiles);
    // Reset input
    input.value = '';
  }

  private uploadFiles(files: File[]): void {
    if (!this.selectedFolder) {
      this.snackBar.open('Пожалуйста, выберите папку для загрузки', 'OK', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }

    this.isUploading = true;
    this.assetsService.uploadAssets(this.selectedFolder, files).subscribe({
      next: () => {
        this.snackBar.open('Файлы успешно загружены', 'OK', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this.loadAssets(); // Перезагружаем список после загрузки
        this.isUploading = false;
      },
      error: (error) => {
        console.error('Error uploading files:', error);
        this.snackBar.open('Ошибка при загрузке файлов', 'OK', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this.isUploading = false;
      }
    });
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    if (!event.dataTransfer?.files.length) return;

    const files = Array.from(event.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
      this.snackBar.open('Пожалуйста, перетащите только изображения', 'OK', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }

    this.uploadFiles(imageFiles);
  }
} 