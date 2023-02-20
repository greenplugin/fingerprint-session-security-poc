import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestResponseLogDialogComponent } from './request-response-log-dialog.component';

describe('RequestResponseLogDialogComponent', () => {
  let component: RequestResponseLogDialogComponent;
  let fixture: ComponentFixture<RequestResponseLogDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestResponseLogDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestResponseLogDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
