import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlassItemComponent } from './glass-item.component';

describe('GlassItemComponent', () => {
  let component: GlassItemComponent;
  let fixture: ComponentFixture<GlassItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlassItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlassItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
