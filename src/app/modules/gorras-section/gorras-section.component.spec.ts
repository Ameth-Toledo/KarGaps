import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GorrasSectionComponent } from './gorras-section.component';

describe('GorrasSectionComponent', () => {
  let component: GorrasSectionComponent;
  let fixture: ComponentFixture<GorrasSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GorrasSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GorrasSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
