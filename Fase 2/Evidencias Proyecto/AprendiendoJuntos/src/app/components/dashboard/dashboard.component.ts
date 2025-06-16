import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { GameLogService } from '../../services/game-log.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [GameLogService]
})
export class DashboardComponent implements OnInit {
  @Output() volver = new EventEmitter<void>();

  logs: any[] = [];
  filteredLogs: any[] = [];
  isLoading = true;

  cursos: string[] = [];
  alumnos: string[] = [];
  juegos: string[] = [];

  // Filtros
  cursoSeleccionado = '';
  alumnoSeleccionado = '';
  juegoSeleccionado = '';
  fechaDesde: string | null = null;
  fechaHasta: string | null = null;
  puntajeMin: number | null = null;

  // Resumen
  totalPartidas = 0;
  alumnosUnicos = 0;
  promedioPuntaje = 0;

  constructor(private gameLogService: GameLogService) {}

  ngOnInit() {
    this.cargarLogs();
  }

  cargarLogs() {
    this.isLoading = true;
    this.gameLogService.getAllLogs().subscribe({
      next: (response: any) => {
        this.logs = (response.data || []).map((log: any) => ({
          ...log,
          game_data: typeof log.game_data === 'string'
            ? (log.game_data ? JSON.parse(log.game_data) : {})
            : (log.game_data || {})
        }));
        this.cursos = Array.from(new Set(this.logs.map((l: any) => l.grade_name)));
        this.alumnos = Array.from(new Set(this.logs.map((l: any) => l.user_name)));
        this.juegos = Array.from(new Set(this.logs.map((l: any) => l.game_id)));
        this.filtrar();
        this.actualizarResumen();
        this.isLoading = false;
      },
      error: () => {
        this.logs = [];
        this.filteredLogs = [];
        this.isLoading = false;
      }
    });
  }

  filtrar() {
    this.filteredLogs = this.logs.filter((log: any) => {
      let cumple = true;
      if (this.cursoSeleccionado && log.grade_name !== this.cursoSeleccionado) cumple = false;
      if (this.alumnoSeleccionado && log.user_name !== this.alumnoSeleccionado) cumple = false;
      if (this.juegoSeleccionado && log.game_id !== this.juegoSeleccionado) cumple = false;
      if (this.fechaDesde && new Date(log.completed_at) < new Date(this.fechaDesde)) cumple = false;
      if (this.fechaHasta && new Date(log.completed_at) > new Date(this.fechaHasta + 'T23:59:59')) cumple = false;
      if (this.puntajeMin && log.game_data?.score < this.puntajeMin) cumple = false;
      return cumple;
    });
    this.actualizarResumen();
  }

  resetFiltros() {
    this.cursoSeleccionado = '';
    this.alumnoSeleccionado = '';
    this.juegoSeleccionado = '';
    this.fechaDesde = null;
    this.fechaHasta = null;
    this.puntajeMin = null;
    this.filtrar();
  }

  hayFiltrosActivos() {
    return this.cursoSeleccionado || this.alumnoSeleccionado || this.juegoSeleccionado || this.fechaDesde || this.fechaHasta || this.puntajeMin;
  }

  actualizarResumen() {
    this.totalPartidas = this.filteredLogs.length;
    const alumnosSet = new Set(this.filteredLogs.map((l: any) => l.user_name));
    this.alumnosUnicos = alumnosSet.size;

    let suma = 0, cuenta = 0;
    for (const log of this.filteredLogs) {
      if (log.game_data && typeof log.game_data.score === 'number') {
        suma += log.game_data.score;
        cuenta++;
      }
    }
    this.promedioPuntaje = cuenta > 0 ? Math.round(suma / cuenta) : 0;
  }

  getScoreClass(score: number) {
    if (score === undefined || score === null) return 'score-empty';
    if (score < 60) return 'score-low';
    if (score < 80) return 'score-mid';
    if (score < 90) return 'score-good';
    return 'score-excellent';
  }

  volverAlLanding() {
    this.volver.emit();
  }
}
