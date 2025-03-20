import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FeedbackService } from '../../services/feedback.service';
import { Feedback } from '../../models/feedback.interface';

@Component({
  selector: 'app-message-dialog',
  standalone: true,
  template: `
    <h2 mat-dialog-title>{{data.title}}</h2>
    <mat-dialog-content>
      <p>{{data.message}}</p>
      <div class="email-info">
        <span>From: {{data.replyEmail}}</span>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      min-width: 300px;
      max-width: 600px;
    }
    p {
      white-space: pre-wrap;
      line-height: 1.5;
      color: #99a3ba;
    }
    .email-info {
      margin-top: 1rem;
      display: flex;
      justify-content: space-between;
      color: #666;
      font-size: 0.875rem;
    }
  `],
  imports: [MatDialogModule, MatButtonModule]
})
export class MessageDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Feedback) {}
}

@Component({
  selector: 'app-responses',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatDialogModule],
  template: `
    <div class="responses-container">
      <div class="card-grid">
        @for (response of responses; track response.id) {
          <mat-card class="response-card">
            <mat-card-content>
              <div class="email">{{response.replyEmail}}</div>
              <div class="title">{{response.title}}</div>
              <p class="message">{{getTruncatedMessage(response.message)}}</p>
              <div class="card-footer">
                <button mat-button color="primary" (click)="openMessage(response)">
                  Open
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        }
      </div>
    </div>
  `,
  styles: [`
    .responses-container {
      padding: 1rem;
      height: 100%;
      overflow: auto;
    }

    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 1rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    @media (min-width: 1400px) {
      .card-grid {
        grid-template-columns: repeat(5, 1fr);
      }
    }

    .response-card {
      background-color: #242424;
      border: 1px solid #333;
      transition: transform 0.2s ease-in-out;
    }

    .response-card:hover {
      transform: translateY(-4px);
    }

    mat-card-content {
      padding: 1rem;
    }

    .email {
      color: #fff;
      margin: 0 0 0.5rem 0;
      font-size: 1rem;
      font-weight: 500;
    }

    .title {
      color: #3b82f6;
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
      font-weight: 500;
    }

    .message {
      color: #99a3ba;
      margin: 0 0 1rem 0;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 5;
      -webkit-box-orient: vertical;
      overflow: hidden;
      white-space: pre-wrap;
    }

    .card-footer {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }

    button {
      color: #3b82f6 !important;
    }
  `]
})
export class ResponsesComponent implements OnInit {
  responses: Feedback[] = [];

  constructor(
    private dialog: MatDialog,
    private feedbackService: FeedbackService
  ) {}

  ngOnInit(): void {
    this.loadFeedbacks();
  }

  private loadFeedbacks(): void {
    console.log('Fetching feedbacks from API...');
    this.feedbackService.getFeedbacks().subscribe({
      next: (feedbacks) => {
        console.log('API Response:', {
          status: 'success',
          timestamp: new Date().toISOString(),
          data: feedbacks,
          count: feedbacks.length
        });
        this.responses = feedbacks;
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

  getTruncatedMessage(message: string): string {
    const lines = message.split('\n');
    if (lines.length > 5) {
      return lines.slice(0, 5).join('\n') + '...';
    }
    return message;
  }

  openMessage(response: Feedback): void {
    this.dialog.open(MessageDialogComponent, {
      data: response,
      panelClass: 'dark-theme-dialog'
    });
  }
} 