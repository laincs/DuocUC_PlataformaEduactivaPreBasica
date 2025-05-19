import { Component, OnInit } from '@angular/core';
import { CommonModule }              from '@angular/common';         // ← Asegúrate de traerlo
import { HeaderComponent }           from './components/header/header.component';
import { AboutComponent }            from './components/about/about.component';
import { FeaturesComponent }         from './components/features/features.component';
import { HowItWorksComponent }       from './components/how-it-works/how-it-works.component';
import { FooterComponent }           from './components/footer/footer.component';
import { LoginComponent }            from './auth/login/login.component';
import { DashboardComponent }        from './components/dashboard/dashboard.component';
import { SupabaseService }           from './services/supabase.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,        
    HeaderComponent,
    AboutComponent,
    FeaturesComponent,
    HowItWorksComponent,
    FooterComponent,
    LoginComponent,
    DashboardComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  viewIndex = 0;

  constructor(private supabase: SupabaseService) {}

  ngOnInit(): void {
  
  }

  goToLanding() {
    this.viewIndex = 0;
  }

  goToLogin() {
    this.viewIndex = 1;
  }

  onLoginSuccess() {
  console.log('🔑 onLoginSuccess() disparado');
  this.viewIndex = 2;
}
}
