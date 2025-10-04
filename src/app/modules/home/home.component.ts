import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { HeroComponent } from "../../components/hero/hero.component";
import { GorrasSectionComponent } from "../gorras-section/gorras-section.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, HeroComponent, GorrasSectionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
