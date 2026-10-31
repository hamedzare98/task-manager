import { Routes } from '@angular/router';
import { TaskList } from './components/task-list/task-list';
import { AuthPage } from './components/auth-page/auth-page';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: TaskList, canActivate: [authGuard] },
  { path: 'login', component: AuthPage },
];