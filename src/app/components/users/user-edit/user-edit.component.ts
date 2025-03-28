import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.interface';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="user-edit-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ isNewUser ? 'Создание пользователя' : 'Редактирование пользователя' }}</mat-card-title>
          <button mat-icon-button (click)="goBack()">
            <mat-icon>close</mat-icon>
          </button>
        </mat-card-header>
        
        <mat-card-content>
          <div *ngIf="loading" class="loading-container">
            <mat-spinner diameter="40"></mat-spinner>
          </div>
          
          <div *ngIf="error" class="error-message">
            {{ error }}
          </div>
          
          <form [formGroup]="userForm" (ngSubmit)="saveUser()" *ngIf="!loading">
            <div class="form-field">
              <mat-form-field appearance="outline">
                <mat-label>Имя</mat-label>
                <input matInput formControlName="name" placeholder="Имя пользователя">
                <mat-error *ngIf="userForm.get('name')?.hasError('required')">
                  Имя обязательно
                </mat-error>
              </mat-form-field>
            </div>
            
            <div class="form-field">
              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput formControlName="email" placeholder="Email пользователя" type="email">
                <mat-error *ngIf="userForm.get('email')?.hasError('required')">
                  Email обязателен
                </mat-error>
                <mat-error *ngIf="userForm.get('email')?.hasError('email')">
                  Введите корректный email
                </mat-error>
              </mat-form-field>
            </div>
            
            <div class="form-field">
              <mat-form-field appearance="outline">
                <mat-label>Логин</mat-label>
                <input matInput formControlName="login" placeholder="Логин пользователя">
                <mat-error *ngIf="userForm.get('login')?.hasError('required')">
                  Логин обязателен
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-field">
              <mat-form-field appearance="outline">
                <mat-label>Бесплатные тиры</mat-label>
                <input matInput formControlName="free_tiers" type="number" placeholder="Количество бесплатных тиров">
                <mat-error *ngIf="userForm.get('free_tiers')?.hasError('required')">
                  Количество тиров обязательно
                </mat-error>
                <mat-error *ngIf="userForm.get('free_tiers')?.hasError('min')">
                  Количество тиров не может быть отрицательным
                </mat-error>
              </mat-form-field>
            </div>
          </form>
        </mat-card-content>
        
        <mat-card-actions align="end">
          <button mat-button (click)="goBack()">Отмена</button>
          <button 
            mat-raised-button 
            color="primary" 
            (click)="saveUser()" 
            [disabled]="userForm.invalid || loading || saving">
            {{ saving ? 'Сохранение...' : 'Сохранить' }}
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .user-edit-container {
      height: 100%;
      padding: 16px;
    }

    mat-card {
      background-color: #242424;
      border: 1px solid #333;
      display: flex;
      flex-direction: column;
      max-width: 600px;
      margin: 0 auto;
    }

    mat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #333;
    }

    mat-card-content {
      padding: 24px;
    }

    .form-field {
      margin-bottom: 16px;
    }

    mat-form-field {
      width: 100%;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 32px;
    }

    .error-message {
      background-color: rgba(244, 67, 54, 0.1);
      color: #f44336;
      padding: 16px;
      border-radius: 4px;
      margin-bottom: 16px;
    }

    mat-card-actions {
      padding: 16px;
      border-top: 1px solid #333;
    }
  `]
})
export class UserEditComponent implements OnInit {
  userId: string | null = null;
  isNewUser = false;
  userForm: FormGroup;
  loading = false;
  saving = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      login: ['', Validators.required],
      free_tiers: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.isNewUser = !this.userId;

    if (this.userId) {
      this.loadUser(this.userId);
    }
  }

  loadUser(id: string): void {
    this.loading = true;
    this.error = null;

    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.userForm.patchValue({
          name: user.name,
          email: user.email,
          login: user.login,
          free_tiers: user.free_tiers
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Не удалось загрузить данные пользователя';
        this.loading = false;
        console.error('Ошибка загрузки пользователя:', err);
      }
    });
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      return;
    }

    this.saving = true;
    this.error = null;

    const userData: Partial<User> = {
      name: this.userForm.value.name,
      email: this.userForm.value.email,
      login: this.userForm.value.login,
      free_tiers: this.userForm.value.free_tiers
    };

    if (this.userId) {
      // Обновление существующего пользователя
      this.userService.updateUser(this.userId, userData).subscribe({
        next: () => {
          this.saving = false;
          this.router.navigate(['/users']);
        },
        error: (err) => {
          this.error = 'Не удалось сохранить изменения';
          this.saving = false;
          console.error('Ошибка обновления пользователя:', err);
        }
      });
    } else {
      // Создание нового пользователя
      this.userService.createUser(userData).subscribe({
        next: () => {
          this.saving = false;
          this.router.navigate(['/users']);
        },
        error: (err) => {
          this.error = 'Не удалось создать пользователя';
          this.saving = false;
          console.error('Ошибка создания пользователя:', err);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
} 