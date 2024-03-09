import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrinterPage } from './printer.page';

describe('PrinterPage', () => {
  let component: PrinterPage;
  let fixture: ComponentFixture<PrinterPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PrinterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
