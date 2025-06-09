import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  gameLogs: any[] = [];
  filteredLogs: any[] = [];
  isLoading = true;

  cursos: string[] = [];
  alumnos: string[] = [];
  cursoSeleccionado = '';
  alumnoSeleccionado = '';

  
  totalPartidas = 0;
  promedioPuntaje = 0;
  ultimoJuego = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarLogs();
  }

  cargarLogs() {
    this.http.get<any>('http://localhost:3000/game_logs').subscribe({
      next: (data) => {
        this.gameLogs = data.data || [];
        this.gameLogs.forEach(log => {
          log.game_data = typeof log.game_data === 'string' ? JSON.parse(log.game_data) : log.game_data;
        });
        this.isLoading = false;

        this.cursos = [...new Set(this.gameLogs.map(log => log.grade_name))];
        this.alumnos = [...new Set(this.gameLogs.map(log => log.user_name))];

        this.filtrar();
      },
      error: (err) => {
        this.isLoading = false;
        alert('Error cargando logs: ' + err.message);
      }
    });
  }

  filtrar() {
    this.filteredLogs = this.gameLogs.filter(log => {
      const matchCurso = this.cursoSeleccionado ? log.grade_name === this.cursoSeleccionado : true;
      const matchAlumno = this.alumnoSeleccionado ? log.user_name === this.alumnoSeleccionado : true;
      return matchCurso && matchAlumno;
    });

    this.totalPartidas = this.filteredLogs.length;
    this.promedioPuntaje = this.filteredLogs.length
      ? Math.round(this.filteredLogs.reduce((sum, log) => sum + (log.game_data.score || 0), 0) / this.filteredLogs.length)
      : 0;
    this.ultimoJuego = this.filteredLogs.length
      ? this.filteredLogs.reduce((latest, log) =>
          !latest || new Date(log.completed_at) > new Date(latest.completed_at) ? log : latest
        ).completed_at
      : '';
  }
}
