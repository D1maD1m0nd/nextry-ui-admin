import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PriceService } from '../../services/price.service';
import { Price } from '../../models/price.interface';

@Component({
  selector: 'app-prices',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="prices-container">
      <div class="prices-header">
        <h1>Тарифные планы</h1>
      </div>

      <div *ngIf="loading" class="loading-container">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="error" class="error-container">
        <p>{{ error }}</p>
        <button mat-button color="primary" (click)="loadPrices()">Повторить</button>
      </div>

      <div class="prices-grid" *ngIf="!loading && !error">
        <mat-card *ngFor="let price of prices" class="price-card">
          <mat-card-header>
            <mat-card-title>{{ price.id }}</mat-card-title>
            <mat-card-subtitle>{{ price.subTitle }}</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <div class="price-info">
              <div class="tiers">
                <span class="tiers-label">Tiers</span>
                <span class="tiers-value">{{ price.tiers }}</span>
              </div>
              
              <div class="price-id" *ngIf="price.priceId">
                <span class="price-id-label">Price ID</span>
                <span class="price-id-value">{{ price.priceId }}</span>
              </div>
            </div>
          </mat-card-content>

          <mat-card-actions align="end">
            <button mat-button color="primary">Подробнее</button>
            <button mat-raised-button color="primary">Выбрать</button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .prices-container {
      padding: 2rem;
      height: 100%;
    }

    .prices-header {
      margin-bottom: 2rem;
    }

    .prices-header h1 {
      color: #fff;
      font-size: 2rem;
      font-weight: 500;
      margin: 0;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
    }

    .error-container {
      text-align: center;
      color: #f44336;
      padding: 2rem;
    }

    .prices-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .price-card {
      background-color: #242424;
      border: 1px solid #333;
    }

    mat-card-header {
      border-bottom: 1px solid #333;
      padding-bottom: 1rem;
    }

    mat-card-title {
      color: #fff;
      font-size: 1.5rem;
    }

    mat-card-subtitle {
      color: #aaa;
    }

    .price-info {
      padding: 1.5rem 0;
    }

    .tiers, .price-id {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .tiers-label, .price-id-label {
      color: #aaa;
    }

    .tiers-value, .price-id-value {
      color: #fff;
      font-weight: 500;
    }

    mat-card-actions {
      border-top: 1px solid #333;
      padding: 1rem;
    }

    button {
      margin-left: 0.5rem;
    }
  `]
})
export class PricesComponent implements OnInit {
  prices: Price[] = [];
  loading = false;
  error: string | null = null;

  constructor(private priceService: PriceService) {}

  ngOnInit(): void {
    this.loadPrices();
  }

  loadPrices(): void {
    this.loading = true;
    this.error = null;

    this.priceService.getPrices().subscribe({
      next: (prices) => {
        this.prices = prices;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Не удалось загрузить тарифные планы';
        this.loading = false;
        console.error('Ошибка загрузки тарифных планов:', err);
      }
    });
  }
} 