import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardPlayerasComponent } from "../../components/card-playeras/card-playeras.component";
import { PlayerasService } from '../../services/playeras/playeras.service';
import { Playera } from '../../models/playera';

@Component({
  selector: 'app-playeras-section',
  standalone: true,
  imports: [CommonModule, CardPlayerasComponent],
  templateUrl: './playeras-section.component.html',
  styleUrl: './playeras-section.component.css'
})
export class PlayerasSectionComponent implements OnInit {
  playeras: Playera[] = [];
  total: number = 0;
  loading: boolean = false;
  error: string = '';

  constructor(private playerasService: PlayerasService) {}

  ngOnInit(): void {
    this.cargarPlayeras();
  }

  cargarPlayeras(): void {
    this.loading = true;
    this.error = '';

    this.playerasService.getPlayeras().subscribe({
      next: (response) => {
        this.playeras = response.playeras;
        this.total = response.total;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las playeras';
        console.error('Error:', err);
        this.loading = false;
      }
    });
  }

  getPrecioNumerico(precio: string | number): number {
    return typeof precio === 'string' ? parseFloat(precio) : precio;
  }
}