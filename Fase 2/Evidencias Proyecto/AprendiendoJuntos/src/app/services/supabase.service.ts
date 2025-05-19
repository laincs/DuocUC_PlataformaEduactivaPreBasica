import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, Session, AuthError } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabaseUrl = environment.supabaseUrl;
  private supabaseAnonKey = environment.supabaseAnonKey;
  public client: SupabaseClient;

  constructor() {
    this.client = createClient(this.supabaseUrl, this.supabaseAnonKey);
  }
   async signIn(email: string, password: string): Promise<{
    data: { session: Session | null; user: any };
    error: AuthError | null;
  }> {
    return this.client.auth.signInWithPassword({ email, password });
  }


  async getUsers(): Promise<any[]> {
    const { data, error } = await this.client
      .from('users')
      .select('*');
    if (error) {
      console.error('Error al leer usuarios:', error);
      return [];
    }
    return data ?? [];
  }

}
