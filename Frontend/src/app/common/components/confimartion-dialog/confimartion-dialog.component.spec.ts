import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfimartionDialogComponent } from './confimartion-dialog.component';

describe('ConfimartionDialogComponent', () => {
  let component: ConfimartionDialogComponent;
  let fixture: ComponentFixture<ConfimartionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfimartionDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfimartionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
