import { Routes } from '@angular/router';
import { ConfigsComponent } from './components/configs/configs.component';
import { ConfigEditComponent } from './components/configs/config-edit.component';
import { HistoryComponent } from './components/history/history.component';
import { ResponsesComponent } from './components/responses/responses.component';

export const routes: Routes = [
  { path: 'configs', component: ConfigsComponent },
  { path: 'configs/:id', component: ConfigEditComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'responses', component: ResponsesComponent },
  { path: '', redirectTo: '/configs', pathMatch: 'full' }
];
