import { Directive, ElementRef, Input } from '@angular/core';
import { TagCommanderService } from '../tag-commander.service/tag-commander.service';

@Directive({
  selector: '[tcSetVars]'
})
export class TcSetVarsDirective {
  @Input('tcSetVars') tcSetVars: object;
  constructor(private el: ElementRef, private tcService: TagCommanderService) { 
  }
  ngAfterViewInit() {
    this.tcService.setTcVars(this.tcSetVars);
  }
}