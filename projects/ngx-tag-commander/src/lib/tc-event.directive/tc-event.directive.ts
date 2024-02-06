import { Directive, ElementRef, Input, HostListener  } from '@angular/core';
import { TagCommanderService } from '../tag-commander.service/tag-commander.service';


// usage [tcEvent]
@Directive({
  selector: '[tcEvent]'
})
export class TcEventDirective {
  @Input() tcEvent: any;
  @Input() tcEventLabel: any;
  @Input() tcEventObj: any;
  constructor(private el: ElementRef, private tcService: TagCommanderService) {
  }

  @HostListener('click') onClick() {
    if (typeof this.tcEvent === 'object' && (this.tcEventLabel === undefined || this.tcEventObj === undefined)) {
      try {
        this.tcService.triggerEvent(this.tcEvent.eventLabel, this.el, this.tcEvent.data);
      } catch (e) {
        console.error(e);
      }
    } else {
      this.tcService.triggerEvent(this.tcEventLabel, this.el, this.tcEventObj);
    }
  }
}
