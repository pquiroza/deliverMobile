import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevopedidoPage } from './nuevopedido.page';

describe('NuevopedidoPage', () => {
  let component: NuevopedidoPage;
  let fixture: ComponentFixture<NuevopedidoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevopedidoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevopedidoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
