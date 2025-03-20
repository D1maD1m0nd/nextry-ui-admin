import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { FeedbackService } from '../../services/feedback.service';
import { Feedback } from '../../models/feedback.interface';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatDividerModule
  ],
  template: `
    <div class="feedback-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Отклики</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-list>
            @for (feedback of feedbacks; track feedback.id) {
              <mat-list-item>
                <div class="feedback-item">
                  <div class="feedback-header">
                    <mat-icon matListItemIcon>feedback</mat-icon>
                    <span class="feedback-title">{{ feedback.title }}</span>
                  </div>
                  <div class="feedback-content">
                    <p class="feedback-message">{{ feedback.message }}</p>
                    <p class="feedback-email">
                      <mat-icon>email</mat-icon>
                      {{ feedback.replyEmail }}
                    </p>
                  </div>
                </div>
              </mat-list-item>
              <mat-divider></mat-divider>
            }
          </mat-list>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .feedback-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .feedback-item {
      width: 100%;
    }

    .feedback-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .feedback-title {
      font-weight: 500;
      font-size: 1.1em;
    }

    .feedback-content {
      margin-left: 40px;
    }

    .feedback-message {
      color: rgba(0, 0, 0, 0.7);
      margin: 8px 0;
    }

    .feedback-email {
      display: flex;
      align-items: center;
      gap: 4px;
      color: rgba(0, 0, 0, 0.6);
      font-size: 0.9em;
    }

    mat-icon {
      color: #673ab7;
    }
  `]
})
export class FeedbackComponent implements OnInit {
  feedbacks: Feedback[] = [];

  constructor(private feedbackService: FeedbackService) {}

  ngOnInit(): void {
    this.loadFeedbacks();
  }

  private loadFeedbacks(): void {
    this.feedbackService.getFeedbacks().subscribe({
      next: (feedbacks) => {
        this.feedbacks = feedbacks;
      },
      error: (error) => {
        console.error('Error loading feedbacks:', error);
      }
    });
  }
} 