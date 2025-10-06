import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from "../../components/header/header.component";
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  recordarme = false;
  mostrarPassword = false;
  cargando = false;
  errorMensaje = '';
  currentYear!: number;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
    
    // Redirigir si ya está autenticado
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['dashboard']);
    }
  }

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  contactarSoporte(event: Event) {
    event.preventDefault();
    
    const mensaje = '*SOLICITUD DE CUENTA - KarGaps*\n\n' +
                   'Hola, me gustaría solicitar una cuenta para acceder a la plataforma KarGaps.\n\n' +
                   'Por favor, proporcióneme los datos necesarios para el registro.\n\n' +
                   'Quedo atento a su respuesta.';
    
    const mensajeCodificado = encodeURIComponent(mensaje);
    const numeroWhatsApp = '5219613037813';
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;
    
    window.open(urlWhatsApp, '_blank');
  }

  onSubmit() {
    this.errorMensaje = '';
    
    if (!this.email || !this.password) {
      return;
    }

    this.cargando = true;

    // Llamar a la API
    this.authService.login({ email: this.email, password: this.password })
      .subscribe({
        next: (response) => {
          console.log('Login exitoso:', response);
          
          // Mensaje de bienvenida con el nombre de la API
          const nombreUsuario = response.data.name;
          console.log(`¡Bienvenido ${nombreUsuario}!`);
          
          // Navegar al home
          this.router.navigate(['dashboard']);
        },
        error: (error) => {
          console.error('Error en login:', error);
          this.errorMensaje = error.message;
          this.cargando = false;
        },
        complete: () => {
          this.cargando = false;
        }
      });
  }
}