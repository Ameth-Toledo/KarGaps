import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerasSectionComponent } from './playeras-section.component';

describe('PlayerasSectionComponent', () => {
  let component: PlayerasSectionComponent;
  let fixture: ComponentFixture<PlayerasSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerasSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerasSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
