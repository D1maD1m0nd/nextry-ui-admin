import { Injectable, computed, signal } from '@angular/core';
import { TauriService } from './tauri.service';

export interface AppState {
  isLoading: boolean;
  error: string | null;
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class StateService {
  // Core state signals
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _data = signal<any>(null);

  // Public readonly signals
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly data = this._data.asReadonly();

  // Computed signals
  readonly hasError = computed(() => this.error() !== null);
  readonly isReady = computed(() => !this.isLoading() && !this.hasError());

  constructor(private tauriService: TauriService) {}

  /**
   * Executes a Tauri command with state management
   * @param command The command to execute
   * @param args Optional arguments for the command
   */
  async executeCommand<T>(command: string, args?: Record<string, unknown>): Promise<T | null> {
    try {
      this._isLoading.set(true);
      this._error.set(null);
      
      const result = await this.tauriService.invokeCommand<T>(command, args);
      this._data.set(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      this._error.set(errorMessage);
      this._data.set(null);
      return null;
    } finally {
      this._isLoading.set(false);
    }
  }

  /**
   * Resets the state to its initial values
   */
  reset(): void {
    this._isLoading.set(false);
    this._error.set(null);
    this._data.set(null);
  }
} 