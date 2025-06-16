import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  showPass = false;
  isLoading = false;
  errorMessage = '';

  @Output() loginSuccess = new EventEmitter<void>();
  @Output() volver = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin(form: NgForm) {
    if (form.invalid) return;
    this.isLoading = true;
    this.errorMessage = '';
    this.authService.login(this.email, this.password).subscribe({
      next: (data: any) => {
        this.isLoading = false;
        // Guarda token o lo que corresponda
        if (data?.token) {
          this.authService.guardarSesion(data.token, data);
          this.router.navigate(['/dashboard']);
          this.loginSuccess.emit();
        } else {
          this.errorMessage = 'Respuesta inesperada del servidor.';
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.error || 'Error al iniciar sesión';
        console.error('❌ Login ERROR:', err);
      }
    });
  }

  volverAlLanding() {
    this.volver.emit();
  }
}
