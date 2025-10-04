import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPlayerasComponent } from './card-playeras.component';

describe('CardPlayerasComponent', () => {
  let component: CardPlayerasComponent;
  let fixture: ComponentFixture<CardPlayerasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardPlayerasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardPlayerasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
