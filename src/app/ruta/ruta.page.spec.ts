import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RutaPage } from './ruta.page';

describe('RutaPage', () => {
  let component: RutaPage;
  let fixture: ComponentFixture<RutaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RutaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RutaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
