import {Component, ElementRef} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {TagCommanderService, TcEventDirective} from 'ngx-tag-commander';

@Component({
  template: `
    <button [tcEvent]="event"></button>`
})
class ButtonWithoutLabelAndObjComponent {
  event = {eventLabel: 'eventLabel', data: {data: 'test'}};
}

@Component({
  template: `
    <button [tcEvent]="event" [tcEventLabel]="eventLabel" [tcEventObj]="eventObj"></button>`
})
class ButtonWithLabelAndObjComponent {
  event = 'event';
  eventLabel = 'anotherEventLabel';
  eventObj = {additionalData: 'moreTest'};
}

describe('TcEventDirective', () => {
  let mockTcService: jasmine.SpyObj<TagCommanderService>;

  beforeEach(() => {
    mockTcService = jasmine.createSpyObj('TagCommanderService', ['triggerEvent']);

    TestBed.configureTestingModule({
      declarations: [TcEventDirective, ButtonWithoutLabelAndObjComponent, ButtonWithLabelAndObjComponent],
      providers: [
        {provide: TagCommanderService, useValue: mockTcService},
      ]
    });
  });

  it('should call triggerEvent on click with tcEvent data if tcEventLabel or tcEventObj are not present and tcEvent is an object', () => {
    const fixture = TestBed.createComponent(ButtonWithoutLabelAndObjComponent);
    const button = fixture.componentInstance;
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('button');
    element.click();

    expect(mockTcService.triggerEvent).toHaveBeenCalledWith(
      button.event.eventLabel,
      new ElementRef(element),
      button.event.data
    );
  });

  it('should call triggerEvent on click with tcEventLabel and tcEventObj if tcEvent is not an object', () => {
    const fixture = TestBed.createComponent(ButtonWithLabelAndObjComponent);
    const button = fixture.componentInstance;
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('button');
    element.click();

    expect(mockTcService.triggerEvent).toHaveBeenCalledWith(
      button.eventLabel,
      new ElementRef(element),
      button.eventObj
    );
  });
});
