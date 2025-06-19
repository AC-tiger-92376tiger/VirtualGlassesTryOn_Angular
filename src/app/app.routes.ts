import { Routes } from '@angular/router';
import { LoginComponent } from './Components/auth/login/login.component';
import { RegisterComponent } from './Components/auth/register/register.component';
import { StartComponent } from './Components/Start/start.component';
import { TaskComponent } from './Components/task/task.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { UsersComponent } from './Components/users/users.component';

export const routes: Routes = [
        { path: 'login', component: LoginComponent },
        { path: 'register', component: RegisterComponent },
        { path: 'start', component:StartComponent},
        { path: 'tasks', component: TaskComponent },
        { path: 'dashboard', component: DashboardComponent },
        { path: 'users', component: UsersComponent },
        
        { path: '**', redirectTo: 'login' }
      
];
