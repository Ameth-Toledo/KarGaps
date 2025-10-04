import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ProductoCarrito {
  nombre: string;
  precio: number;
  color: string;
  imagen: string;
  cantidad: number;
  stock: number; 
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private productos = new BehaviorSubject<ProductoCarrito[]>([]);
  productos$ = this.productos.asObservable();

  private mostrarAlerta = new BehaviorSubject<boolean>(false);
  mostrarAlerta$ = this.mostrarAlerta.asObservable();

  agregarProducto(producto: Omit<ProductoCarrito, 'cantidad'>) {
    const productosActuales = this.productos.value;
    const existente = productosActuales.find(p => 
      p.nombre === producto.nombre && p.color === producto.color
    );

    if (existente) {
      if (existente.cantidad < existente.stock) {
        existente.cantidad++;
        this.productos.next([...productosActuales]);
        this.activarAlerta();
      }
    } else {
      this.productos.next([...productosActuales, { ...producto, cantidad: 1 }]);
      this.activarAlerta();
    }
  }

  aumentarCantidad(index: number) {
    const productosActuales = this.productos.value;
    const producto = productosActuales[index];
    if (producto.cantidad < producto.stock) {
      producto.cantidad++;
      this.productos.next([...productosActuales]);
    }
  }

  disminuirCantidad(index: number) {
    const productosActuales = this.productos.value;
    const producto = productosActuales[index];
    if (producto.cantidad > 1) {
      producto.cantidad--;
      this.productos.next([...productosActuales]);
    } else {
      this.eliminarProducto(index);
    }
  }

  eliminarProducto(index: number) {
    const productosActuales = this.productos.value;
    productosActuales.splice(index, 1);
    this.productos.next([...productosActuales]);
  }

  getCantidadTotal(): number {
    return this.productos.value.reduce((total, p) => total + p.cantidad, 0);
  }

  getTotal(): number {
    return this.productos.value.reduce((total, p) => total + (p.precio * p.cantidad), 0);
  }

  getProductos(): ProductoCarrito[] {
    return this.productos.value;
  }

  private activarAlerta() {
    this.mostrarAlerta.next(true);
    setTimeout(() => {
      this.mostrarAlerta.next(false);
    }, 3000);
  }
}