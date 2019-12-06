import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallepedidoPage } from './detallepedido.page';

describe('DetallepedidoPage', () => {
  let component: DetallepedidoPage;
  let fixture: ComponentFixture<DetallepedidoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetallepedidoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallepedidoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
