import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  // al arrancar rediriges al login
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // tu pantalla de login
  { path: 'login',    component: LoginComponent   },
  // tu dashboard tras el éxito
  { path: 'dashboard', component: DashboardComponent },
  // opcionalmente una ruta comodín
  { path: '**', redirectTo: '' }
];
