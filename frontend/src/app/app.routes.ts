import { Routes } from '@angular/router';
import { TaskList } from './components/task-list/task-list';
import { AuthPage } from './components/auth-page/auth-page';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: AuthPage },
  {
    path: '',
    canActivateChild: [authGuard],
    children: [
      { path: '', component: TaskList },
      
    ],
  },
  { path: '**', redirectTo: '' },
];