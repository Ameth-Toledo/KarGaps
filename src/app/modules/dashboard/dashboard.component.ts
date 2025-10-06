import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { GorrasService } from '../../services/gorras/gorras.service';
import { PlayerasService } from '../../services/playeras/playeras.service';

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
  
  // Estadísticas
  estadisticas = {
    totalPlayeras: 0,
    totalGorras: 0,
    ventasHoy: 12,
    ingresosMes: 15240.50
  };

  // Formulario Gorra
  nuevaGorra = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    color: '',
    imagen: null as File | null
  };

  // Formulario Playera
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

  // Alertas
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
        avatar: 1 // Avatar por defecto, o puedes obtenerlo de otra fuente
      };
      
      // Si necesitas obtener el avatar del usuario desde la API
      // this.usersService.getUserById(currentUser.userId).subscribe({
      //   next: (user) => {
      //     if (this.userData && user.avatar) {
      //       this.userData.avatar = typeof user.avatar === 'number' ? user.avatar : parseInt(user.avatar);
      //     }
      //   }
      // });
    }
  }

  cargarEstadisticas() {
    this.gorrasService.getGorras().subscribe({
      next: (response) => {
        this.estadisticas.totalGorras = response.total;
      }
    });

    this.playerasService.getPlayeras().subscribe({
      next: (response) => {
        this.estadisticas.totalPlayeras = response.total;
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
  }

  onImagenGorraSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.nuevaGorra.imagen = file;
    }
  }

  onImagenPlayeraSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.nuevaPlayera.imagen = file;
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