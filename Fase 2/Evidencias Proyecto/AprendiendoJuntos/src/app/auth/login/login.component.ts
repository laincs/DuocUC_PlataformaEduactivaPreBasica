import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';

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
  isLoading = false;
  errorMessage: string | null = null;

  @Output() loginSuccess = new EventEmitter<void>();

  constructor(private supabase: SupabaseService) {}


async onSubmit(form: NgForm) {
  if (form.invalid) return;
  this.isLoading = true;
  const { data, error } = await this.supabase.signIn(this.email, this.password);
  this.isLoading = false;
  if (error) {
    this.errorMessage = error.message;
  } else {
    const url = window.location.origin + '/dashboard';
      window.open(url, '_blank');
    console.log('✅ Login OK — emito loginSuccess'); 
    this.loginSuccess.emit();
  }
}
}
