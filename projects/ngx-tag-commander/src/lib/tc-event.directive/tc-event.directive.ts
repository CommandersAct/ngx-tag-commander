import { Directive, ElementRef, Input, HostListener  } from '@angular/core';
import { TagCommanderService } from '../tag-commander.service/tag-commander.service';


// usage [tcEvent]
@Directive({
  selector: '[tcEvent]'
})
export class TcEventDirective {
  @Input('tcEvent') tcEvent:any;
  @Input('tcEventLabel') tcEventLabel:any;
  @Input('tcEventObj') tcEventObj:any;
  constructor(private el: ElementRef, private tcService: TagCommanderService) {
  }

  @HostListener('click') onClick() {
    if (typeof this.tcEvent === 'object' && (this.tcEventLabel === undefined || this.tcEventObj === undefined)) {
      try {
        this.tcService.captureEvent(this.tcEvent.eventLabel, this.el, this.tcEvent.data);
      } catch (e) {
        console.error(e);
      }
    } else {
      this.tcService.captureEvent(this.tcEventLabel, this.el, this.tcEventObj);
    }
  }
}
