import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FingerprintDialogComponent } from './fingerprint-dialog.component';

describe('FingerprintDialogComponent', () => {
  let component: FingerprintDialogComponent;
  let fixture: ComponentFixture<FingerprintDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FingerprintDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FingerprintDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
