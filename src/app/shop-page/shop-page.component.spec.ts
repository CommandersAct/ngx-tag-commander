import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {ShopPageComponent} from './shop-page.component';
import {WindowRef} from 'ngx-tag-commander';

class MockWindowRef {
  nativeWindow = {tc_vars: {}};
}

describe('ShopPageComponent', () => {
  let component: ShopPageComponent;
  let fixture: ComponentFixture<ShopPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ShopPageComponent],
      providers: [{provide: WindowRef, useClass: MockWindowRef}]
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
