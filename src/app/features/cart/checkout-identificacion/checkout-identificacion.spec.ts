import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutIdentificacion } from './checkout-identificacion';

describe('CheckoutIdentificacion', () => {
  let component: CheckoutIdentificacion;
  let fixture: ComponentFixture<CheckoutIdentificacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutIdentificacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutIdentificacion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
