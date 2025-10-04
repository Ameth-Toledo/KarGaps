import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent implements OnInit {
  currentYear!: number;

  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
  }
}
