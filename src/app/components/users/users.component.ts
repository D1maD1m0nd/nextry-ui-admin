import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatTableModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="users-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Управление пользователями</mat-card-title>
          <button mat-icon-button color="primary" (click)="addUser()">
            <mat-icon>add</mat-icon>
          </button>
        </mat-card-header>
        <mat-card-content>
          <div *ngIf="loading" class="loading-container">
            <mat-spinner diameter="40"></mat-spinner>
          </div>
          
          <div *ngIf="!loading && error" class="error-container">
            <p>Ошибка загрузки пользователей: {{ error }}</p>
            <button mat-button color="primary" (click)="loadUsers()">Повторить</button>
          </div>
          
          <table *ngIf="!loading && !error" mat-table [dataSource]="users" class="users-table">
            <!-- Имя пользователя -->
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Имя</th>
              <td mat-cell *matCellDef="let user">{{ user.name }}</td>
            </ng-container>
            
            <!-- Email -->
            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let user">{{ user.email }}</td>
            </ng-container>
            
            <!-- Логин -->
            <ng-container matColumnDef="login">
              <th mat-header-cell *matHeaderCellDef>Логин</th>
              <td mat-cell *matCellDef="let user">{{ user.login }}</td>
            </ng-container>
            
            <!-- Действия -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Действия</th>
              <td mat-cell *matCellDef="let user">
                <button mat-icon-button color="primary" (click)="editUser(user.id)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteUser(user.id, $event)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>
            
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" (click)="editUser(row.id)"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .users-container {
      height: 100%;
    }

    mat-card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    mat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    mat-card-content {
      flex: 1;
      overflow: auto;
      padding: 16px;
    }
    
    .loading-container {
      display: flex;
      justify-content: center;
      padding: 32px;
    }
    
    .error-container {
      color: #f44336;
      text-align: center;
      padding: 16px;
    }
    
    .users-table {
      width: 100%;
    }
    
    .mat-column-actions {
      width: 120px;
      text-align: center;
    }
    
    .users-table tr.mat-row {
      cursor: pointer;
    }
    
    .users-table tr.mat-row:hover {
      background-color: rgba(255, 255, 255, 0.05);
    }
  `]
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['name', 'email', 'login', 'actions'];
  loading = false;
  error: string | null = null;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;
    
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
        console.log('Загружено пользователей:', users.length);
      },
      error: (error) => {
        this.error = 'Не удалось загрузить список пользователей';
        this.loading = false;
        console.error('Ошибка при загрузке пользователей:', error);
      }
    });
  }

  addUser(): void {
    this.router.navigate(['/users/new']);
  }

  editUser(id: string): void {
    this.router.navigate(['/users', id]);
  }

  deleteUser(id: string, event: Event): void {
    event.stopPropagation(); // Предотвращает срабатывание клика по строке
    
    if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers(); // Перезагружаем список пользователей
        },
        error: (error) => {
          console.error('Ошибка при удалении пользователя:', error);
          // Тут можно добавить уведомление об ошибке
        }
      });
    }
  }
} 