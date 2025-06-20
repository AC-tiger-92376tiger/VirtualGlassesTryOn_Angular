import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraDetectViewerComponent } from './camera-detect-viewer.component';

describe('CameraDetectViewerComponent', () => {
  let component: CameraDetectViewerComponent;
  let fixture: ComponentFixture<CameraDetectViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CameraDetectViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CameraDetectViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
