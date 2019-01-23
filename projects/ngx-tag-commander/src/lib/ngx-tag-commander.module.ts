import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TagCommanderService} from './tag-commander.service/tag-commander.service';
import { TcSetVarsDirective } from './tc-set-vars.directive/tc-set-vars.directive';
import { TcEventDirective } from './tc-event.directive/tc-event.directive';

import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

@NgModule({
  declarations: [TcSetVarsDirective, TcEventDirective],
  imports: [
    CommonModule,
    LoggerModule.forRoot({level: NgxLoggerLevel.DEBUG, serverLogLevel: NgxLoggerLevel.ERROR})
  ],
  exports: [TcSetVarsDirective, TcEventDirective],
  providers: [TagCommanderService]
})
export class NgxTagCommanderModule { }
