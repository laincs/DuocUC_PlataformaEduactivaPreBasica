import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent }     from './components/header/header.component';
import { FeaturesComponent }   from './components/features/features.component';
import { HowItWorksComponent } from './components/how-it-works/how-it-works.component';
import { FooterComponent }     from './components/footer/footer.component';
import { AboutComponent } from './components/about/about.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    AboutComponent,
    HeaderComponent,
    FeaturesComponent,
    HowItWorksComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {}
