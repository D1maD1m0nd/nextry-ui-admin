import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatTableModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
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
          <form [formGroup]="searchForm" class="search-form">
            <mat-form-field appearance="outline">
              <mat-label>Поиск по имени</mat-label>
              <input matInput formControlName="nameSearch" placeholder="Введите имя">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Поиск по email</mat-label>
              <input matInput formControlName="emailSearch" placeholder="Введите email">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </form>

          <div *ngIf="loading" class="loading-container">
            <mat-spinner diameter="40"></mat-spinner>
          </div>
          
          <div *ngIf="!loading && error" class="error-container">
            <p>Ошибка загрузки пользователей: {{ error }}</p>
            <button mat-button color="primary" (click)="loadUsers()">Повторить</button>
          </div>
          
          <table *ngIf="!loading && !error" mat-table [dataSource]="filteredUsers$" class="users-table">
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

            <!-- Бесплатные тиры -->
            <ng-container matColumnDef="free_tiers">
              <th mat-header-cell *matHeaderCellDef>Бесплатные тиры</th>
              <td mat-cell *matCellDef="let user">{{ user.free_tiers }}</td>
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

    .search-form {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }

    mat-form-field {
      flex: 1;
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

    .mat-column-free_tiers {
      width: 150px;
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
  filteredUsers$!: Observable<User[]>;
  displayedColumns: string[] = ['name', 'email', 'login', 'free_tiers', 'actions'];
  loading = false;
  error: string | null = null;
  searchForm: FormGroup;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      nameSearch: [''],
      emailSearch: ['']
    });

    // Инициализируем поисковый Observable
    this.filteredUsers$ = this.searchForm.valueChanges.pipe(
      startWith({ nameSearch: '', emailSearch: '' }),
      debounceTime(300),
      distinctUntilChanged(),
      map(search => this.filterUsers(search))
    );

    // Подписываемся на изменения формы для обновления URL
    this.searchForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.updateUrl(value);
    });
  }

  ngOnInit(): void {
    // Подписываемся на изменения URL
    this.route.queryParams.subscribe(params => {
      this.searchForm.patchValue({
        nameSearch: params['name'] || '',
        emailSearch: params['email'] || ''
      }, { emitEvent: false }); // Предотвращаем срабатывание valueChanges
    });

    this.loadUsers();
  }

  private updateUrl(searchParams: { nameSearch: string; emailSearch: string }): void {
    const queryParams: any = {};
    
    if (searchParams.nameSearch?.trim()) {
      queryParams.name = searchParams.nameSearch.trim();
    }
    if (searchParams.emailSearch?.trim()) {
      queryParams.email = searchParams.emailSearch.trim();
    }

    // Если все поля пустые, очищаем URL
    if (Object.keys(queryParams).length === 0) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {},
        queryParamsHandling: 'merge'
      });
    } else {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams,
        queryParamsHandling: 'merge'
      });
    }
  }

  private filterUsers(search: { nameSearch: string; emailSearch: string }): User[] {
    const filteredUsers = this.users.filter(user => {
      const nameMatch = !search.nameSearch || 
        user.name.toLowerCase().includes(search.nameSearch.toLowerCase());
      const emailMatch = !search.emailSearch || 
        user.email.toLowerCase().includes(search.emailSearch.toLowerCase());
      return nameMatch && emailMatch;
    });

    console.log('Поисковый запрос:', {
      name: search.nameSearch,
      email: search.emailSearch,
      найдено: filteredUsers.length,
      всего: this.users.length
    });

    return filteredUsers;
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