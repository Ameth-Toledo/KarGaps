import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from "../../components/header/header.component";

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

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
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

    setTimeout(() => {
      if (this.email === 'admin@kargaps.com' && this.password === '123456') {
        console.log('Login exitoso');
        this.router.navigate(['/']); 
      } else {
        this.errorMensaje = 'Correo o contraseña incorrectos';
        this.cargando = false;
      }
    }, 1500);
  }
}