import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { UpdateService } from '../../services/update.service';

@Component({
  selector: 'app-update-checker',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule],
  template: '',
  styles: []
})
export class UpdateCheckerComponent implements OnInit {
  constructor(
    private updateService: UpdateService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.checkForUpdates();
    this.subscribeToUpdateStatus();
  }

  private async checkForUpdates() {
    await this.updateService.checkForUpdates();
  }

  private subscribeToUpdateStatus() {
    this.updateService.updateStatus$.subscribe(status => {
      if (status) {
        this.snackBar.open(status, 'Закрыть', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      }
    });
  }
} 