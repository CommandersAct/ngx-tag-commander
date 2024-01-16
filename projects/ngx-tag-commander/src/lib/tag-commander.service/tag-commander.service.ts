// our root app component
import {Router, ActivationEnd} from '@angular/router';
import {WindowRef} from './WindowRef';
import {Injectable, Inject, PLATFORM_ID} from '@angular/core';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';

/** @dynamic */
@Injectable({
  providedIn: 'root',
})
export class TagCommanderService {
  _tcContainers: Array<any> = [];
  pageEvent: any;
  _trackRoutes = false;
  debug: boolean;

  debug_logger(...args: any[]) {
    if (this.debug) {
      console.log.apply(console, args);
    }
  }

  constructor(
    private winRef: WindowRef,
    private router: Router,
    @Inject(DOCUMENT) private _doc: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.router.events.subscribe((_data) => {
      if (_data instanceof ActivationEnd && this._trackRoutes) {
        if (_data.snapshot.data.tcInclude !== undefined) {
          const data: Array<any> = _data.snapshot.data.tcInclude;
          data.forEach((container) => {
            this.reloadContainer(
              container['ids'],
              container['idc'],
              container['options']
            );
          });
        }
      }
    });
  }

  // /**
  //  * the script URI correspond to the tag-commander script URL, it can either be a CDN URL or the path of your script
  //  * @param {string} id the id the script node will have
  //  * @param {string} uri the source of the script
  //  * @param {string} node the node on witch the script will be placed, it can either be head or body
  // */
  addContainer(id: string, uri: string, node: string): Promise<void> {
    return new Promise((resolve) => {
      this._tcContainers.push({id: id, uri: uri});
      const tagContainer = this._doc.createElement('script');
      tagContainer.onload = () => resolve();
      tagContainer.setAttribute('type', 'text/javascript');
      tagContainer.setAttribute('src', uri);
      tagContainer.setAttribute('id', id);
      if (typeof node !== 'string') {
        this.debug_logger(
          'you didn\'t specify where you wanted to place the script, it will be placed in the head by default'
        );
        this._doc.querySelector('head').appendChild(tagContainer);
      } else if (
        node.toLowerCase() === 'head' ||
        node.toLowerCase() === 'body'
      ) {
        this._doc.querySelector(node.toLowerCase()).appendChild(tagContainer);
      } else {
        this.debug_logger(
          'you didn\'t correctily specify where you wanted to place the script, it will be placed in the head by default'
        );
        this._doc.querySelector('head').appendChild(tagContainer);
      }
    });
  }

  // /**
  //  * The script URI correspond to the tag-commander script URL, it can either be a CDN URL or the path of your script
  //  * @param {string} id
  //  */
  removeContainer(id: string): void {
    const container = this._doc.getElementById(id);
    const containers = this._tcContainers.slice(0);

    for (let i = 0; i < containers.length; i++) {
      if (containers[i].id === id) {
        const node = containers[i].node.toLowerCase();
        const parent = this._doc.getElementsByTagName(node)[0];
        if (parent && container && container.parentNode === parent) {
          parent.removeChild(container);
        }
        this._tcContainers.splice(i, 1);
      }
    }
  }

  // /**
  //  * will display the debug messages if true
  //  * @param {boolean} debug if set to true it will activate the debug msg default is false
  //  */
  setDebug(debug: boolean): void {
    this.debug = debug;
  }

  // /**
  //  * allows the router to be tracked
  //  * @param {boolean} b will read routes if set to true
  //  */
  trackRoutes(b: boolean): void {
    this._trackRoutes = !!b;
  }

  // /**
  //  * set or update the value of the var
  //  * @param {string} tcKey
  //  * @param {*} tcVar
  //  */
  setTcVar(tcKey: string, tcVar: any) {
    if (isPlatformBrowser(this.platformId)) {
      if (!this.winRef.nativeWindow.tc_vars) {
        throw new Error(
          '[ngx-tag-commander] setTcVar failed because no window.tc_vars was found. Did you initialize it?'
        );
      }
      this.winRef.nativeWindow.tc_vars[tcKey] = tcVar;
    }
  }

  // /**
  //  * set your variables for the different providers, when called the first time it
  //  * instantiate the external variable
  //  * @param {object} vars
  //  */
  setTcVars(vars: object): void {
    if (isPlatformBrowser(this.platformId)) {
      this.debug_logger('setTcVars', vars);
      const listOfVars = Object.keys(vars);
      for (let i = 0; i < listOfVars.length; i++) {
        this.setTcVar(listOfVars[i], vars[listOfVars[i]]);
      }
    }
  }

  // /**
  //  * get the value of the var
  //  * @param {string} tcKey
  //  */
  getTcVar(tcKey: string): any {
    if (isPlatformBrowser(this.platformId)) {
      this.debug_logger('getTcVar', tcKey);
      if (this.winRef.nativeWindow.tc_vars[tcKey] === null || this.winRef.nativeWindow.tc_vars[tcKey] === undefined) {
        throw new Error(
          '[ngx-tag-commander]tc_var is undefined. Check that it\'s properly initialized'
        );
      }
      return this.winRef.nativeWindow.tc_vars[tcKey];
    }
  }

  // /**
  //  * removes the var by specifying the key
  //  * @param {string} varKey
  //  */
  removeTcVar(varKey: string): void {
    if (isPlatformBrowser(this.platformId)) {
      this.debug_logger('removeTcVar', varKey);
      delete this.winRef.nativeWindow.tc_vars[varKey];
    }
  }

  // /**
  //  * will reload all the containers
  //  * @param {object} options can contain some options in a form of an object
  //  */
  reloadAllContainers(options: object = {}): number {
    if (isPlatformBrowser(this.platformId)) {
      this.debug_logger(
        'Reload all containers ', options
      );

      if (!this.winRef.nativeWindow.tC) {
        return window.setTimeout(() => {
          this.reloadAllContainers(options);
        }, 1000);
      }
      this.winRef.nativeWindow.tC.container.reload(options);
    }
  }

  // /**
  //  * will reload the specified container
  //  * @param {number} siteId
  //  * @param {number} idc
  //  * @param {object} options can contain some options in a form of an object
  //  */
  reloadContainer(siteId: string, containerId: string, options: object): number {
    if (isPlatformBrowser(this.platformId)) {
      options = options || {};
      this.debug_logger(
        'Reload container ids: ' + siteId + ' idc: ' + containerId,
        typeof options === 'object' ? 'with options: ' : '', options || ''
      );
      if (!this.winRef.nativeWindow.tC) {
        return window.setTimeout(() => {
          this.reloadContainer(siteId, containerId, options);
        }, 1000);
      }
      this.winRef.nativeWindow.tC['container_' + siteId + '_' + containerId].reload(
        options
      );
    }
  }

  // /**
  //  * will set an TagCommander event
  //  * @param {string} eventLabel the name of your event
  //  * @param {HTMLElement} element the HTMLelement on witch the event is attached
  //  * @param {object} data the data you want to transmit
  //  */
  captureEvent(
    eventLabel: string,
    element: any,
    data: object,
    reloadCapture = false
  ) {
    if (isPlatformBrowser(this.platformId)) {
      if (reloadCapture !== true) {
        this.debug_logger('captureEvent', eventLabel, element, data);
        if (typeof this.winRef.nativeWindow.tC !== 'undefined') {
          if (eventLabel in this.winRef.nativeWindow.tC.event) {
            this.winRef.nativeWindow.tC.event[eventLabel](element, data);
          }
          if (!(eventLabel in this.winRef.nativeWindow.tC.event)) {
            setTimeout(() => {
              this.captureEvent(
                eventLabel,
                element,
                data,
                (reloadCapture = true)
              );
            }, 1000);
          }
        }
      }
    }
  }
}
