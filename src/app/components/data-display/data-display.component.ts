import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-data-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="data-display">
      <!-- Loading state -->
      @if (stateService.isLoading()) {
        <div class="loading">Loading...</div>
      }

      <!-- Error state -->
      @if (stateService.hasError()) {
        <div class="error">
          Error: {{ stateService.error() }}
          <button (click)="retryCommand()">Retry</button>
        </div>
      }

      <!-- Data display -->
      @if (stateService.isReady()) {
        <div class="data">
          <h3>Data from Rust:</h3>
          <pre>{{ formattedData() }}</pre>
        </div>
      }

      <!-- Action buttons -->
      <div class="actions">
        <button 
          (click)="fetchData()"
          [disabled]="stateService.isLoading()">
          Fetch Data
        </button>
        <button 
          (click)="stateService.reset()"
          [disabled]="stateService.isLoading()">
          Reset
        </button>
      </div>
    </div>
  `,
  styles: [`
    .data-display {
      padding: 1rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      margin: 1rem;
    }

    .loading {
      color: #666;
      font-style: italic;
    }

    .error {
      color: #dc3545;
      margin: 1rem 0;
    }

    .data {
      margin: 1rem 0;
    }

    pre {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 4px;
      overflow: auto;
    }

    .actions {
      margin-top: 1rem;
      display: flex;
      gap: 0.5rem;
    }

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      background: #0d6efd;
      color: white;
      cursor: pointer;
    }

    button:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }

    button:not(:disabled):hover {
      background: #0b5ed7;
    }
  `]
})
export class DataDisplayComponent {
  // Computed signal for formatted data
  readonly formattedData = computed(() => {
    const data = this.stateService.data();
    return data ? JSON.stringify(data, null, 2) : 'No data';
  });

  constructor(public stateService: StateService) {}

  private lastCommand?: { name: string; args?: Record<string, unknown> };

  async fetchData() {
    this.lastCommand = {
      name: 'get_data',
      args: { timestamp: new Date().toISOString() }
    };
    await this.stateService.executeCommand(
      this.lastCommand.name,
      this.lastCommand.args
    );
  }

  async retryCommand() {
    if (this.lastCommand) {
      await this.stateService.executeCommand(
        this.lastCommand.name,
        this.lastCommand.args
      );
    }
  }
} 