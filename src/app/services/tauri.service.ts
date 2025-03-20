import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';

@Injectable({
  providedIn: 'root'
})
export class TauriService {
  constructor() {}

  /**
   * Invokes a Rust command from the frontend
   * @param command The name of the command to invoke
   * @param args Arguments to pass to the command
   */
  async invokeCommand<T>(command: string, args?: Record<string, unknown>): Promise<T> {
    return invoke<T>(command, args);
  }
} 