import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-image-preview-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <h2 mat-dialog-title>{{ data.name }}</h2>
        <button mat-icon-button (click)="onClose()">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      <mat-dialog-content>
        <div class="image-container">
          <img [src]="data.url" [alt]="data.name" (error)="onImageError($event)">
          @if (showFallback) {
            <div class="image-fallback">
              <mat-icon>image_not_supported</mat-icon>
              <span>Изображение отсутствует</span>
            </div>
          }
        </div>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button (click)="onClose()">Закрыть</button>
        <button mat-raised-button color="primary" (click)="onDownload()">
          <mat-icon>download</mat-icon>
          Скачать
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      background-color: #242424;
      color: #fff;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid #333;

      h2 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 500;
      }
    }

    mat-dialog-content {
      flex: 1;
      padding: 1rem;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .image-container {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #1a1a1a;
      border-radius: 4px;
      overflow: hidden;

      img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
    }

    .image-fallback {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 1rem;
      text-align: center;

      mat-icon {
        font-size: 3rem;
        width: 3rem;
        height: 3rem;
        color: #666;
      }

      span {
        font-size: 0.9rem;
        color: #99a3ba;
      }
    }

    mat-dialog-actions {
      padding: 1rem;
      border-top: 1px solid #333;
      gap: 0.5rem;
    }
  `]
})
export class ImagePreviewDialogComponent {
  showFallback = false;

  constructor(
    public dialogRef: MatDialogRef<ImagePreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { url: string; name: string }
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  onDownload(): void {
    window.open(this.data.url, '_blank');
  }

  onImageError(event: Event): void {
    this.showFallback = true;
  }
} 