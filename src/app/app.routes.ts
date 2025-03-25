import { Routes } from '@angular/router';
import { ConfigsComponent } from './components/configs/configs.component';
import { ConfigEditComponent } from './components/configs/config-edit.component';
import { HistoryComponent } from './components/history/history.component';
import { ResponsesComponent } from './components/responses/responses.component';
import { AssetsComponent } from './components/assets/assets.component';
import { UsersComponent } from './components/users/users.component';
import { UserEditComponent } from './components/users/user-edit/user-edit.component';

export const routes: Routes = [
  { path: '', redirectTo: '/configs', pathMatch: 'full' },
  { path: 'configs', component: ConfigsComponent },
  { path: 'configs/:id', component: ConfigEditComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'responses', component: ResponsesComponent },
  { path: 'assets', component: AssetsComponent },
  { path: 'users', component: UsersComponent },
  { path: 'users/new', component: UserEditComponent },
  { path: 'users/:id', component: UserEditComponent }
];
