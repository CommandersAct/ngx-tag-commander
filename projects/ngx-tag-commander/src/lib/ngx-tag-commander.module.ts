import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TagCommanderService } from './tag-commander.service/tag-commander.service';
import { TcSetVarsDirective } from './tc-set-vars.directive/tc-set-vars.directive';
import { TcEventDirective } from './tc-event.directive/tc-event.directive';

@NgModule({
  declarations: [TcSetVarsDirective, TcEventDirective],
  imports: [
    CommonModule
  ],
  exports: [TcSetVarsDirective, TcEventDirective],
  providers: [TagCommanderService]
})
export class NgxTagCommanderModule { }
