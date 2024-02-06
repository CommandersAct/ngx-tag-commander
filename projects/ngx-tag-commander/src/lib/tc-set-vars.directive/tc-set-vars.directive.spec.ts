import {Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TagCommanderService, TcSetVarsDirective} from 'ngx-tag-commander';

@Component({
  template: `
    <div [tcSetVars]="testVars"></div>`
})
class DivComponent {
  testVars = {var1: 'value1', var2: 'value2'};
}

describe('TcSetVarsDirective', () => {
  let mockTcService: jasmine.SpyObj<TagCommanderService>;
  let fixture: ComponentFixture<DivComponent>;
  let divComponent: DivComponent;

  beforeEach(() => {
    mockTcService = jasmine.createSpyObj('TagCommanderService', ['setTcVars']);

    TestBed.configureTestingModule({
      declarations: [TcSetVarsDirective, DivComponent],
      providers: [
        {provide: TagCommanderService, useValue: mockTcService}
      ]
    });

    fixture = TestBed.createComponent(DivComponent);
    divComponent = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngAfterViewInit
  });

  it('should call setTcVars with correct data on ngAfterViewInit', () => {
    expect(mockTcService.setTcVars).toHaveBeenCalledWith(divComponent.testVars);
  });
});
