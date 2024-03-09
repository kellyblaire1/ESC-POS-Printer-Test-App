import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrintersPage } from './printers.page';

describe('PrintersPage', () => {
  let component: PrintersPage;
  let fixture: ComponentFixture<PrintersPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PrintersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
