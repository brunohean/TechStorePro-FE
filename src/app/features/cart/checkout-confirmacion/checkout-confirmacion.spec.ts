import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutConfirmacion } from './checkout-confirmacion';

describe('CheckoutConfirmacion', () => {
  let component: CheckoutConfirmacion;
  let fixture: ComponentFixture<CheckoutConfirmacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutConfirmacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutConfirmacion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
