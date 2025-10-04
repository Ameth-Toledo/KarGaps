import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardGorrasComponent } from "../../components/card-gorras/card-gorras.component";
import { GorrasService } from '../../services/gorras/gorras.service';
import { Gorra } from '../../models/gorra';

@Component({
  selector: 'app-gorras-section',
  standalone: true,
  imports: [CardGorrasComponent, CommonModule],
  templateUrl: './gorras-section.component.html',
  styleUrl: './gorras-section.component.css'
})
export class GorrasSectionComponent implements OnInit {
  gorras: Gorra[] = [];
  total: number = 0;
  loading: boolean = false;
  error: string = '';

  constructor(private gorrasService: GorrasService) {}

  ngOnInit(): void {
    this.cargarGorras();
  }

  cargarGorras(): void {
    this.loading = true;
    this.error = '';
    
    this.gorrasService.getGorras().subscribe({
      next: (response) => {
        this.gorras = response.gorras;
        this.total = response.total;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las gorras';
        console.error('Error:', err);
        this.loading = false;
      }
    });
  }

  getPrecioNumerico(precio: string | number): number {
    return typeof precio === 'string' ? parseFloat(precio) : precio;
  }
}