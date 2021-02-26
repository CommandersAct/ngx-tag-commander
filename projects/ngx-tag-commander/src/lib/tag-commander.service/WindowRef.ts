import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { DOCUMENT, isPlatformBrowser } from "@angular/common";

function _window(): any {
  return window;
}

@Injectable()
export class WindowRef {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  get nativeWindow(): any {
    if (isPlatformBrowser(this.platformId)) {
      return _window();
    }
    return {};
  }
}
