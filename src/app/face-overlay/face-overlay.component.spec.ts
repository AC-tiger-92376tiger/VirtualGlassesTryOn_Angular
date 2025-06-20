import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceOverlayComponent } from './face-overlay.component';

describe('FaceOverlayComponent', () => {
  let component: FaceOverlayComponent;
  let fixture: ComponentFixture<FaceOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaceOverlayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaceOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
