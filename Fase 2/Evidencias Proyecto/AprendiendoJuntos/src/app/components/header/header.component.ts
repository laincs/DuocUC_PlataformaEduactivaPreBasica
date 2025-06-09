import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Output() showLogin = new EventEmitter<void>();
  @Output() showLanding = new EventEmitter<void>();

  emitShowLogin() {
    this.showLogin.emit();
  }
  emitShowLanding() {
    this.showLanding.emit();
  }
}
