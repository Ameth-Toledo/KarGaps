import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito/carrito.service';

@Component({
  selector: 'app-card-gorras',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-gorras.component.html',
  styleUrl: './card-gorras.component.css'
})
export class CardGorrasComponent {
  @Input() nombre: string = '';
  @Input() descripcion: string = '';
  @Input() precio: number = 0;
  @Input() stock: number = 0;
  @Input() color: string = '';
  @Input() imagen: string = '';
  
  private coloresMap: { [key: string]: string } = {
    'negro': '#000000',
    'blanco': '#FFFFFF',
    'rojo': '#FF0000',
    'azul': '#0000FF',
    'verde': '#00FF00',
    'amarillo': '#FFFF00',
    'rosa': '#FFC0CB',
    'morado': '#800080',
    'naranja': '#FFA500',
    'gris': '#808080',
    'cafe': '#8B4513',
    'beige': '#F5F5DC'
  };
  
  constructor(private carritoService: CarritoService) {}
  
  get colorHex(): string {
    const colorLower = this.color.toLowerCase();
    return this.coloresMap[colorLower] || this.color;
  }
  
  agregarAlCarrito() {
    if (this.stock > 0) {
      this.carritoService.agregarProducto({
        nombre: this.nombre,
        precio: this.precio,
        color: this.color,
        imagen: this.imagen,
        stock: this.stock
      });
    }
  }
}