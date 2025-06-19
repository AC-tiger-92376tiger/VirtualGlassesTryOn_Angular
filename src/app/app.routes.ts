import { Routes } from '@angular/router';
import { LoginComponent } from './Components/auth/login/login.component';
import { RegisterComponent } from './Components/auth/register/register.component';
import { SettingComponent } from './Components/setting/setting.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { CustomerComponent } from './Components/customer/customer.component';

export const routes: Routes = [
        { path: 'login', component: LoginComponent },
        { path: 'register', component: RegisterComponent },
        { path: 'setting-page', component: SettingComponent },
        { path: 'dashboard', component: DashboardComponent },
        { path: 'customer-page', component: CustomerComponent },
        
        { path: '**', redirectTo: 'login' }
      
];
