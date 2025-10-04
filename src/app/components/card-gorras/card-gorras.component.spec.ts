import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardGorrasComponent } from './card-gorras.component';

describe('CardGorrasComponent', () => {
  let component: CardGorrasComponent;
  let fixture: ComponentFixture<CardGorrasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardGorrasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardGorrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
