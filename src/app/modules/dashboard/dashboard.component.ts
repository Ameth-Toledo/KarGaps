import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { GorrasService } from '../../services/gorras/gorras.service';
import { PlayerasService } from '../../services/playeras/playeras.service';
import { Playera } from '../../models/playera';

interface DashboardUserData {
  name: string;
  email: string;
  userId: number;
  avatar?: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  menuAbierto = false;
  vistaActual: string = 'inicio';
  userData: DashboardUserData | null = null;
  
  estadisticas = {
    totalPlayeras: 0,
    totalGorras: 0,
    ventasHoy: 12,
    ingresosMes: 15240.50
  };

  nuevaGorra = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    color: '',
    imagen: null as File | null
  };

  nuevaPlayera = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    color: '',
    talla: '',
    tipo: '',
    material: '',
    imagen: null as File | null
  };

  playeras: any[] = [];
  playerasFiltradas: any[] = [];
  playeraEditando: any = null;
  busquedaPlayeras = '';

  gorras: any[] = [];
  gorrasFiltradas: any[] = [];
  gorraEditando: any = null;
  busquedaGorras = '';

  mostrarAlerta = false;
  mensajeAlerta = '';
  tipoAlerta: 'success' | 'error' = 'success';

  constructor(
    private authService: AuthService,
    private gorrasService: GorrasService,
    private playerasService: PlayerasService
  ) {}

  ngOnInit() {
    this.cargarDatosUsuario();
    this.cargarEstadisticas();
  }

  cargarDatosUsuario() {
    const currentUser = this.authService.getCurrentUserData();
    if (currentUser) {
      this.userData = {
        name: currentUser.name,
        email: currentUser.email,
        userId: currentUser.userId,
        avatar: 1
      };
    }
  }

  cargarEstadisticas() {
    this.cargarGorras();
    this.cargarPlayeras();
  }

  cargarGorras() {
    this.gorrasService.getGorras().subscribe({
      next: (response) => {
        this.gorras = response.gorras.map(gorra => ({
          ...gorra,
          precio: typeof gorra.precio === 'string' ? parseFloat(gorra.precio) : gorra.precio
        }));
        this.gorrasFiltradas = this.gorras;
        this.estadisticas.totalGorras = response.total;
      },
      error: (error) => {
        console.error('Error al cargar gorras:', error);
      }
    });
  }

  cargarPlayeras() {
    this.playerasService.getPlayeras().subscribe({
      next: (response) => {
        this.playeras = response.playeras.map(playera => ({
          ...playera,
          precio: typeof playera.precio === 'string' ? parseFloat(playera.precio) : playera.precio
        }));
        this.playerasFiltradas = this.playeras;
        this.estadisticas.totalPlayeras = response.total;
      },
      error: (error) => {
        console.error('Error al cargar playeras:', error);
      }
    });
  }

  getAvatarUrl(): string {
    return `/avatars/${this.userData?.avatar || 1}.png`;
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  cambiarVista(vista: string) {
    this.vistaActual = vista;
    this.menuAbierto = false;
    this.resetFormularios();
    
    if (vista === 'ver-playeras' || vista === 'editar-playeras' || vista === 'eliminar-playeras') {
      this.cargarPlayeras();
    }
    
    if (vista === 'ver-gorras' || vista === 'editar-gorras' || vista === 'eliminar-gorras') {
      this.cargarGorras();
    }
  }

  resetFormularios() {
    this.nuevaGorra = {
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      color: '',
      imagen: null
    };

    this.nuevaPlayera = {
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      color: '',
      talla: '',
      tipo: '',
      material: '',
      imagen: null
    };

    this.playeraEditando = null;
    this.busquedaPlayeras = '';
    this.gorraEditando = null;
    this.busquedaGorras = '';
  }

  buscarPlayeras() {
    if (!this.busquedaPlayeras.trim()) {
      this.playerasFiltradas = this.playeras;
      return;
    }

    const busqueda = this.busquedaPlayeras.toLowerCase();
    this.playerasFiltradas = this.playeras.filter(playera =>
      playera.nombre.toLowerCase().includes(busqueda) ||
      playera.color.toLowerCase().includes(busqueda) ||
      playera.talla.toLowerCase().includes(busqueda)
    );
  }

  seleccionarPlayeraParaEditar(playera: any) {
    this.playeraEditando = { ...playera };
    this.nuevaPlayera = {
      nombre: playera.nombre,
      descripcion: playera.descripcion,
      precio: typeof playera.precio === 'string' ? parseFloat(playera.precio) : playera.precio,
      stock: playera.stock,
      color: playera.color,
      talla: playera.talla,
      tipo: playera.tipo,
      material: playera.material,
      imagen: null
    };
  }

  actualizarPlayera() {
    if (!this.playeraEditando) return;

    if (!this.validarFormularioPlayeraEdicion()) {
      this.mostrarMensaje('Por favor completa todos los campos', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', this.nuevaPlayera.nombre);
    formData.append('descripcion', this.nuevaPlayera.descripcion);
    formData.append('precio', this.nuevaPlayera.precio.toString());
    formData.append('stock', this.nuevaPlayera.stock.toString());
    formData.append('color', this.nuevaPlayera.color);
    formData.append('talla', this.nuevaPlayera.talla);
    formData.append('tipo', this.nuevaPlayera.tipo);
    formData.append('material', this.nuevaPlayera.material);
    
    if (this.nuevaPlayera.imagen) {
      formData.append('imagen', this.nuevaPlayera.imagen);
    }

    this.playerasService.updatePlayera(this.playeraEditando.id, formData).subscribe({
      next: () => {
        this.mostrarMensaje('Playera actualizada exitosamente', 'success');
        this.cargarPlayeras();
        this.playeraEditando = null;
        this.resetFormularios();
      },
      error: (error) => {
        this.mostrarMensaje('Error al actualizar la playera', 'error');
        console.error(error);
      }
    });
  }

  cancelarEdicion() {
    this.playeraEditando = null;
    this.resetFormularios();
  }

  eliminarPlayera(id: number) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta playera?')) {
      return;
    }

    this.playerasService.deletePlayera(id).subscribe({
      next: () => {
        this.mostrarMensaje('Playera eliminada exitosamente', 'success');
        this.cargarPlayeras();
      },
      error: (error) => {
        this.mostrarMensaje('Error al eliminar la playera', 'error');
        console.error(error);
      }
    });
  }

  onImagenPlayeraSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.nuevaPlayera.imagen = file;
    }
  }

  agregarPlayera() {
    if (!this.validarFormularioPlayera()) {
      this.mostrarMensaje('Por favor completa todos los campos', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', this.nuevaPlayera.nombre);
    formData.append('descripcion', this.nuevaPlayera.descripcion);
    formData.append('precio', this.nuevaPlayera.precio.toString());
    formData.append('stock', this.nuevaPlayera.stock.toString());
    formData.append('color', this.nuevaPlayera.color);
    formData.append('talla', this.nuevaPlayera.talla);
    formData.append('tipo', this.nuevaPlayera.tipo);
    formData.append('material', this.nuevaPlayera.material);
    if (this.nuevaPlayera.imagen) {
      formData.append('imagen', this.nuevaPlayera.imagen);
    }

    this.playerasService.createPlayera(formData).subscribe({
      next: () => {
        this.mostrarMensaje('Playera agregada exitosamente', 'success');
        this.resetFormularios();
        this.cargarEstadisticas();
      },
      error: (error) => {
        this.mostrarMensaje('Error al agregar la playera', 'error');
        console.error(error);
      }
    });
  }

  buscarGorras() {
    if (!this.busquedaGorras.trim()) {
      this.gorrasFiltradas = this.gorras;
      return;
    }

    const busqueda = this.busquedaGorras.toLowerCase();
    this.gorrasFiltradas = this.gorras.filter(gorra =>
      gorra.nombre.toLowerCase().includes(busqueda) ||
      gorra.color.toLowerCase().includes(busqueda)
    );
  }

  seleccionarGorraParaEditar(gorra: any) {
    this.gorraEditando = { ...gorra };
    this.nuevaGorra = {
      nombre: gorra.nombre,
      descripcion: gorra.descripcion,
      precio: typeof gorra.precio === 'string' ? parseFloat(gorra.precio) : gorra.precio,
      stock: gorra.stock,
      color: gorra.color,
      imagen: null
    };
  }

  actualizarGorra() {
    if (!this.gorraEditando) return;

    if (!this.validarFormularioGorraEdicion()) {
      this.mostrarMensaje('Por favor completa todos los campos', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', this.nuevaGorra.nombre);
    formData.append('descripcion', this.nuevaGorra.descripcion);
    formData.append('precio', this.nuevaGorra.precio.toString());
    formData.append('stock', this.nuevaGorra.stock.toString());
    formData.append('color', this.nuevaGorra.color);
    
    if (this.nuevaGorra.imagen) {
      formData.append('imagen', this.nuevaGorra.imagen);
    }

    this.gorrasService.updateGorra(this.gorraEditando.id, formData).subscribe({
      next: () => {
        this.mostrarMensaje('Gorra actualizada exitosamente', 'success');
        this.cargarGorras();
        this.gorraEditando = null;
        this.resetFormularios();
      },
      error: (error) => {
        this.mostrarMensaje('Error al actualizar la gorra', 'error');
        console.error(error);
      }
    });
  }

  cancelarEdicionGorra() {
    this.gorraEditando = null;
    this.resetFormularios();
  }

  eliminarGorra(id: number) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta gorra?')) {
      return;
    }

    this.gorrasService.deleteGorra(id).subscribe({
      next: () => {
        this.mostrarMensaje('Gorra eliminada exitosamente', 'success');
        this.cargarGorras();
      },
      error: (error) => {
        this.mostrarMensaje('Error al eliminar la gorra', 'error');
        console.error(error);
      }
    });
  }

  onImagenGorraSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.nuevaGorra.imagen = file;
    }
  }

  agregarGorra() {
    if (!this.validarFormularioGorra()) {
      this.mostrarMensaje('Por favor completa todos los campos', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', this.nuevaGorra.nombre);
    formData.append('descripcion', this.nuevaGorra.descripcion);
    formData.append('precio', this.nuevaGorra.precio.toString());
    formData.append('stock', this.nuevaGorra.stock.toString());
    formData.append('color', this.nuevaGorra.color);
    if (this.nuevaGorra.imagen) {
      formData.append('imagen', this.nuevaGorra.imagen);
    }

    this.gorrasService.createGorra(formData).subscribe({
      next: () => {
        this.mostrarMensaje('Gorra agregada exitosamente', 'success');
        this.resetFormularios();
        this.cargarEstadisticas();
      },
      error: (error) => {
        this.mostrarMensaje('Error al agregar la gorra', 'error');
        console.error(error);
      }
    });
  }

  validarFormularioGorra(): boolean {
    return !!(
      this.nuevaGorra.nombre &&
      this.nuevaGorra.descripcion &&
      this.nuevaGorra.precio > 0 &&
      this.nuevaGorra.stock >= 0 &&
      this.nuevaGorra.color &&
      this.nuevaGorra.imagen
    );
  }

  validarFormularioPlayera(): boolean {
    return !!(
      this.nuevaPlayera.nombre &&
      this.nuevaPlayera.descripcion &&
      this.nuevaPlayera.precio > 0 &&
      this.nuevaPlayera.stock >= 0 &&
      this.nuevaPlayera.color &&
      this.nuevaPlayera.talla &&
      this.nuevaPlayera.tipo &&
      this.nuevaPlayera.material &&
      this.nuevaPlayera.imagen
    );
  }

  validarFormularioPlayeraEdicion(): boolean {
    return !!(
      this.nuevaPlayera.nombre &&
      this.nuevaPlayera.descripcion &&
      this.nuevaPlayera.precio > 0 &&
      this.nuevaPlayera.stock >= 0 &&
      this.nuevaPlayera.color &&
      this.nuevaPlayera.talla &&
      this.nuevaPlayera.tipo &&
      this.nuevaPlayera.material
    );
  }

  validarFormularioGorraEdicion(): boolean {
    return !!(
      this.nuevaGorra.nombre &&
      this.nuevaGorra.descripcion &&
      this.nuevaGorra.precio > 0 &&
      this.nuevaGorra.stock >= 0 &&
      this.nuevaGorra.color
    );
  }

  mostrarMensaje(mensaje: string, tipo: 'success' | 'error') {
    this.mensajeAlerta = mensaje;
    this.tipoAlerta = tipo;
    this.mostrarAlerta = true;

    setTimeout(() => {
      this.mostrarAlerta = false;
    }, 3000);
  }

  cerrarSesion() {
    this.authService.logout();
  }
}