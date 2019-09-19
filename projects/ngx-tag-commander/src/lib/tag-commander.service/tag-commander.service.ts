// our root app component
import { Router, RoutesRecognized } from '@angular/router';
import { WindowRef } from './WindowRef';
import { Injectable } from '@angular/core';

@Injectable()
export class TagCommanderService {
  _tcContainers: Array<any> = [];
  pageEvent: any;
  _trackRoutes = false;
  old_console_log = console.log;

  constructor(
    private winRef: WindowRef,
    private router: Router
  ) {
    this.router.events.subscribe(_data => {
      if (_data instanceof RoutesRecognized && this._trackRoutes) {
        if (typeof _data.state.root.firstChild.data.tcInclude !== 'undefined') {
          const data: Array<any> = _data.state.root.firstChild.data.tcInclude;
          data.forEach(container => {
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
  addContainer(id: string, uri: string, node: string): void {
    this._tcContainers.push({ id: id, uri: uri });
    const tagContainer = document.createElement('script');
    tagContainer.setAttribute('type', 'text/javascript');
    tagContainer.setAttribute('src', uri);
    tagContainer.setAttribute('id', id);
    if (typeof node !== 'string') {
      this.old_console_log(
        'you didn\'t specify where you wanted to place the script, it will be placed in the head by default'
      )
      document.querySelector('head').appendChild(tagContainer);
    } else if (node.toLowerCase() === 'head' || node.toLowerCase() === 'body') {
      document.querySelector(node.toLowerCase()).appendChild(tagContainer);
    } else {
      this.old_console_log(
        'you didn\'t correctily specify where you wanted to place the script, it will be placed in the head by default'
      )
      document.querySelector('head').appendChild(tagContainer);
    }
  }

  // /**
  //  * The script URI correspond to the tag-commander script URL, it can either be a CDN URL or the path of your script
  //  * @param {string} id
  //  */
  removeContainer(id: string): void {
    const container = document.getElementById(id);
    const containers = this._tcContainers.slice(0);

    document.querySelector('head').removeChild(container);

    for (let i = 0; i < containers.length; i++) {
      if (containers[i].id === id) {
        this._tcContainers.splice(i, 1);
      }
    }
  }

  // /**
  //  * will display the debug messages if true
  //  * @param {boolean} debug if set to true it will activate the debug msg default is false
  //  */
  setDebug(debug: boolean): void {
    if (debug) {
      this.old_console_log;
    } else {
      this.old_console_log = function () { }
    }
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
    if (!this.winRef.nativeWindow.tc_vars) {
      return setTimeout(() => {
        this.setTcVar(tcKey, tcVar);
      }, 1000);
    }
    this.winRef.nativeWindow.tc_vars[tcKey] = tcVar;
  }

  // /**
  //  * set your varibles for the different providers, when called the first time it
  //  * instantiate the external varible
  //  * @param {object} vars
  //  */
  setTcVars(vars: object): void {
    this.old_console_log('setTcVars', vars)
    const listOfVars = Object.keys(vars);
    for (let i = 0; i < listOfVars.length; i++) {
      this.setTcVar(listOfVars[i], vars[listOfVars[i]]);
    }
  }

  // /**
  //  * get the value of the var
  //  * @param {string} tcKey
  //  */
  getTcVar(tcKey: string): any {
    this.old_console_log('getTcVars', tcKey);
    return this.winRef.nativeWindow.tc_vars[tcKey] === null
      ? this.winRef.nativeWindow.tc_vars[tcKey]
      : false;
  }

  // /**
  //  * removes the var by specifying the key
  //  * @param {string} varKey
  //  */
  removeTcVar(varKey: string): void {
    this.old_console_log('removeTcVars', varKey);
    delete this.winRef.nativeWindow.tc_vars[varKey];
  }

  // /**
  //  * will reload all the containers
  //  * @param {object} options can contain some options in a form of an object
  //  */
  reloadAllContainers(options: object) {
    this.old_console_log('reloadAllContainers', options);
    options = options || {};
    this.old_console_log(
      'Reload all containers ',
      typeof options === 'object' ? 'with options ' + options : ''
    )

    if (!this.winRef.nativeWindow.tC) {
      return setTimeout(() => {
        this.reloadAllContainers(options);
      }, 1000);
    }
    this.winRef.nativeWindow.tC.container.reload(options);
  }

  // /**
  //  * will reload a specifique container
  //  * @param {number} ids
  //  * @param {number} idc
  //  * @param {object} options can contain some options in a form of an object
  //  */
  reloadContainer(ids: string, idc: string, options: object) {
    const opt = options || {};
    this.old_console_log(
      'Reload container ids: ' + ids + ' idc: ' + idc,
      typeof opt === 'object' ? 'with options: ' + opt : ''
    );

    if (!this.winRef.nativeWindow.tC) {
      return setTimeout(() => {
        this.reloadContainer(ids, idc, options);
      }, 1000);
    }
    this.winRef.nativeWindow.tC['container_' + ids + '_' + idc].reload(options);
  }

  // /**
  //  * will set an TagCommander event
  //  * @param {string} eventLabel the name of your event
  //  * @param {HTMLElement} element the HTMLelement on witch the event is attached
  //  * @param {object} data the data you want to transmit
  //  */
  captureEvent(eventLabel: string, element: any, data: object, reloadCapture = false) {
    let reloadFunction;
    if (reloadCapture === true) {
      clearTimeout(reloadFunction);
    } else {
      this.old_console_log('captureEvent', eventLabel, element, data)
      if (typeof this.winRef.nativeWindow.tC !== 'undefined') {
        if (eventLabel in this.winRef.nativeWindow.tC.event) {
          this.winRef.nativeWindow.tC.event[eventLabel](element, data);
        }
        if (!(eventLabel in this.winRef.nativeWindow.tC.event)) {
          reloadFunction = setTimeout(() => {
            this.captureEvent(eventLabel, element, data, reloadCapture = true);
          }, 1000);
        }
      }
    }
  }
}
