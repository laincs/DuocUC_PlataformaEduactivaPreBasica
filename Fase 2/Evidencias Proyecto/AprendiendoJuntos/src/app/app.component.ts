import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { AboutComponent } from './components/about/about.component';
import { FeaturesComponent } from './components/features/features.component';
import { HowItWorksComponent } from './components/how-it-works/how-it-works.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
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

  constructor() {}

  ngOnInit(): void {}

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
