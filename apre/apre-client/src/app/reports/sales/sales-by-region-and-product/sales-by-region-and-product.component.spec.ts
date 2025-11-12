import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesByRegionAndProductComponent } from './sales-by-region-and-product.component';

describe('SalesByRegionAndProductComponent', () => {
  let component: SalesByRegionAndProductComponent;
  let fixture: ComponentFixture<SalesByRegionAndProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesByRegionAndProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesByRegionAndProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
