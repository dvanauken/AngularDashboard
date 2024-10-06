import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerSelectorComponent } from './layer-selector.component';

describe('LayerSelectorComponent', () => {
  let component: LayerSelectorComponent;
  let fixture: ComponentFixture<LayerSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LayerSelectorComponent]
    });
    fixture = TestBed.createComponent(LayerSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
