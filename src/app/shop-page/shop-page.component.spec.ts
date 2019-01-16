import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopPageComponent } from './shop-page.component';

describe('ShopPageComponent', () => {
  let component: ShopPageComponent;
  let fixture: ComponentFixture<ShopPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
