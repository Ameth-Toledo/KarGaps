import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoService, ProductoCarrito } from '../../services/carrito/carrito.service';
import { GorrasService } from '../../services/gorras/gorras.service';
import { Gorra } from '../../models/gorra';
import { Subscription, debounceTime, Subject, forkJoin } from 'rxjs';
import { PlayerasService } from '../../services/playeras/playeras.service';
import { Playera } from '../../models/playera';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  menuAbierto = false;
  busquedaAbierta = false;
  carritoAbierto = false;
  cantidadCarrito = 0;
  productosCarrito: ProductoCarrito[] = [];
  totalCarrito = 0;
  mostrarAlerta = false;
  
  terminoBusqueda = '';
  resultadosBusqueda: Gorra[] = [];
  resultadosBusquedaPlayera: Playera[] = [];
  buscando = false;
  mostrarResultados = false;
  private busquedaSubject = new Subject<string>();
  
  @Output() resultadosBusquedaEmitidos = new EventEmitter<Gorra[]>();
  
  private subscription?: Subscription;
  private alertaSubscription?: Subscription;
  private busquedaSubscription?: Subscription;
  
  constructor(
    private carritoService: CarritoService,
    private gorrasService: GorrasService,
    private playerasService: PlayerasService,
    private router: Router
  ) {}
  
  ngOnInit() {
    this.subscription = this.carritoService.productos$.subscribe(productos => {
      this.productosCarrito = productos;
      this.cantidadCarrito = this.carritoService.getCantidadTotal();
      this.totalCarrito = this.carritoService.getTotal();
    });

    this.alertaSubscription = this.carritoService.mostrarAlerta$.subscribe(mostrar => {
      this.mostrarAlerta = mostrar;
    });

    this.busquedaSubscription = this.busquedaSubject
      .pipe(debounceTime(300))
      .subscribe(termino => {
        if (termino.trim().length > 0) {
          this.realizarBusqueda(termino);
        } else {
          this.limpiarBusqueda();
        }
      });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.alertaSubscription?.unsubscribe();
    this.busquedaSubscription?.unsubscribe();
  }
  
  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }
  
  cerrarMenu() {
    this.menuAbierto = false;
  }
  
  toggleBusqueda() {
    this.busquedaAbierta = !this.busquedaAbierta;
    if (!this.busquedaAbierta) {
      this.limpiarBusqueda();
    }
  }
  
  toggleCarrito() {
    this.carritoAbierto = !this.carritoAbierto;
  }

  onBusquedaChange(termino: string) {
    this.terminoBusqueda = termino;
    this.busquedaSubject.next(termino);
  }

  realizarBusqueda(termino: string) {
    this.buscando = true;
    
    forkJoin({
      gorras: this.gorrasService.searchGorras(termino),
      playeras: this.playerasService.searchPlayeras(termino)
    }).subscribe({
      next: (results) => {
        this.resultadosBusqueda = results.gorras.gorras;
        this.resultadosBusquedaPlayera = results.playeras.playeras;
        this.mostrarResultados = true;
        this.buscando = false;
        
        this.resultadosBusquedaEmitidos.emit(results.gorras.gorras);
      },
      error: (error) => {
        console.error('Error en búsqueda:', error);
        this.buscando = false;
        this.resultadosBusqueda = [];
        this.resultadosBusquedaPlayera = [];
        this.mostrarResultados = true;
      }
    });
  }

  limpiarBusqueda() {
    this.terminoBusqueda = '';
    this.resultadosBusqueda = [];
    this.resultadosBusquedaPlayera = [];
    this.mostrarResultados = false;
    this.buscando = false;
    this.resultadosBusquedaEmitidos.emit([]);
  }

  cerrarResultados() {
    this.mostrarResultados = false;
  }

  getPrecioNumerico(precio: string | number): number {
    return typeof precio === 'string' ? parseFloat(precio) : precio;
  }

  aumentarCantidad(index: number) {
    this.carritoService.aumentarCantidad(index);
  }

  disminuirCantidad(index: number) {
    this.carritoService.disminuirCantidad(index);
  }

  eliminarProducto(index: number) {
    this.carritoService.eliminarProducto(index);
  }

  procederAlPago() {
    let mensaje = '*SOLICITUD DE PEDIDO - KarGaps*\n\n';
    mensaje += 'Hola, me gustaría realizar el siguiente pedido:\n\n';
    mensaje += '*Productos:*\n';
    
    this.productosCarrito.forEach((producto, index) => {
      mensaje += `\n${index + 1}. ${producto.nombre}\n`;
      mensaje += `   • Color: ${producto.color}\n`;
      mensaje += `   • Precio unitario: $${producto.precio.toFixed(2)}\n`;
      mensaje += `   • Cantidad: ${producto.cantidad}\n`;
      mensaje += `   • Subtotal: $${(producto.precio * producto.cantidad).toFixed(2)}\n`;
    });
    
    mensaje += `\n*TOTAL: $${this.totalCarrito.toFixed(2)} MXN*\n\n`;
    mensaje += 'Me gustaría confirmar la disponibilidad, coordinar el método de pago y acordar la entrega.\n\n';
    mensaje += 'Quedo atento a su respuesta.';
    
    const mensajeCodificado = encodeURIComponent(mensaje);
    const numeroWhatsApp = '5219612041185';
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;
    window.open(urlWhatsApp, '_blank');
  }

  sendToLogin(event: Event) {
    event.preventDefault();
    this.router.navigate(['login'])
  }
}