import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TagCommanderService} from 'ngx-tag-commander';
import {WindowRef} from './WindowRef';
import {Router, Routes} from '@angular/router';
import {Component} from '@angular/core';

class MockWindowRef {
  nativeWindow = {tc_vars: {}};
}

class MockWindowRefNoTcVars {
  nativeWindow = {};
}

@Component({
  template: ''
})
class DummyRouteComponent {
}

const testRoutes: Routes = [
  {path: 'test', component: DummyRouteComponent, data: {tcInclude: [{ids: 'someSiteId', idc: 'someContainerId', options: {}}]}}
];

describe('TagCommanderService', () => {
  let service: TagCommanderService;
  let windowRef: WindowRef;
  let router: Router;

  describe('', () => {

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule.withRoutes(testRoutes)],
        providers: [
          TagCommanderService,
          {provide: WindowRef, useClass: MockWindowRef}
        ]
      });

      service = TestBed.inject(TagCommanderService);
      windowRef = TestBed.inject(WindowRef);
      router = TestBed.inject(Router);

      service.trackRoutes(true);
      service.debug_logger(true);
    });

    it('should reload container on route change', async () => {
      // Create Spy
      spyOn(service, 'reloadContainer').and.callThrough();

      // Trigger Route change
      await router.navigate(['/test']);

      // Assertions
      expect(service.reloadContainer).toHaveBeenCalledWith('someSiteId', 'someContainerId', {});
    });

    it('addContainer() should add a container to the DOM into the specified node', async () => {
      // Input variables
      const id = 'someId';
      const uri = 'http://example.com/script.js';
      const node = 'body';

      // Mocks
      const mockHead = jasmine.createSpyObj('HTMLHeadElement', ['appendChild']);
      const mockBody = jasmine.createSpyObj('HTMLBodyElement', ['appendChild']);
      const mockContainerScriptElement = jasmine.createSpyObj('HTMLScriptElement', ['setAttribute', 'onload']);
      spyOn(document, 'createElement').and.returnValue(mockContainerScriptElement);
      spyOn(document, 'querySelector').and.callFake((selector: string) => {
        if (selector === 'head') {
          return mockHead;
        }
        if (selector === 'body') {
          return mockBody;
        }
        return null;
      });

      // Call function
      const addContainerPromise = service.addContainer(id, uri, node);

      mockContainerScriptElement.onload(null);

      await addContainerPromise;

      // Assertions
      expect(service['_tcContainers']).toContain({id: id, uri: uri});
      expect(document.createElement).toHaveBeenCalledWith('script');
      expect(mockBody.appendChild).toHaveBeenCalledWith(mockContainerScriptElement);
      expect(mockHead.appendChild).not.toHaveBeenCalled();
    });

    it('addContainer() should add a container to the head otherwise', async () => {
      // Input variables
      const id = 'someId';
      const uri = 'http://example.com/script.js';
      const node = 'someNode';

      // Mocks
      const mockHead = jasmine.createSpyObj('HTMLHeadElement', ['appendChild']);
      const mockBody = jasmine.createSpyObj('HTMLBodyElement', ['appendChild']);
      const mockContainerScriptElement = jasmine.createSpyObj('HTMLScriptElement', ['setAttribute', 'onload']);
      spyOn(document, 'createElement').and.returnValue(mockContainerScriptElement);
      spyOn(document, 'querySelector').and.callFake((selector: string) => {
        if (selector === 'head') {
          return mockHead;
        }
        if (selector === 'body') {
          return mockBody;
        }
        return null;
      });

      // Call function
      const addContainerPromise = service.addContainer(id, uri, node);

      mockContainerScriptElement.onload(null);

      await addContainerPromise;

      // Assertions
      expect(service['_tcContainers']).toContain({id: id, uri: uri});
      expect(document.createElement).toHaveBeenCalledWith('script');
      expect(mockHead.appendChild).toHaveBeenCalledWith(mockContainerScriptElement);
      expect(mockBody.appendChild).not.toHaveBeenCalled();
    });

    it('removeContainer() should remove a container if it exists', () => {
      const id = 'existingId';
      const uri = 'someUrl';
      const node = 'body';
      service._tcContainers = [{id: id, uri: uri, node: node}];

      // Mocks
      const parent = jasmine.createSpyObj('HTMLBodyElement', ['removeChild']);
      const containerElement = jasmine.createSpyObj('HTMLScriptElement', [], {parentNode: parent});
      spyOn(document, 'getElementById').and.callFake((id: string) => {
        if (id === 'existingId') {
          return containerElement;
        } else {
          return null;
        }
      });
      spyOn(document, 'getElementsByTagName').and.returnValue([parent] as unknown as HTMLCollectionOf<Element>);

      // Call function
      service.removeContainer(id);

      // Assertions
      expect(document.getElementById).toHaveBeenCalledWith(id);
      expect(document.getElementsByTagName).toHaveBeenCalledWith(node);
      expect(parent.removeChild).toHaveBeenCalledWith(containerElement);
      expect(service._tcContainers.length).toBe(0);
    });

    it('removeContainer() should not remove a container if it does not exist', () => {
      service._tcContainers = [{id: 'existingId', uri: 'someUrl', node: 'body'}];

      // Mocks
      const parent = jasmine.createSpyObj('HTMLBodyElement', ['removeChild']);
      const containerElement = jasmine.createSpyObj('HTMLScriptElement', [], {parentNode: parent});
      spyOn(document, 'getElementById').and.callFake((id: string) => {
        if (id === 'existingId') {
          return containerElement;
        } else {
          return null;
        }
      });
      spyOn(document, 'getElementsByTagName').and.returnValue([parent] as unknown as HTMLCollectionOf<Element>);

      // Call function
      service.removeContainer('nonExistingId');

      // Assertions
      expect(document.getElementById).toHaveBeenCalledWith('nonExistingId');
      expect(document.getElementsByTagName).not.toHaveBeenCalled();
      expect(parent.removeChild).not.toHaveBeenCalled();
      expect(service._tcContainers.length).toBe(1);
    });

    it('removeContainer() should handle the case where the container is not in the DOM', () => {
      service._tcContainers = [{id: 'existingId', uri: 'someUrl', node: 'body'}];

      // Mocks
      const parent = jasmine.createSpyObj('HTMLBodyElement', ['removeChild']);
      const containerElement = jasmine.createSpyObj('HTMLScriptElement', [], {parentNode: parent});
      spyOn(document, 'getElementById').and.returnValue(null);
      spyOn(document, 'getElementsByTagName').and.returnValue([parent] as unknown as HTMLCollectionOf<Element>);

      // Call function
      service.removeContainer('existingId');

      // Assertions
      expect(document.getElementById).toHaveBeenCalledWith('existingId');
      expect(document.getElementsByTagName).toHaveBeenCalledWith('body');
      expect(parent.removeChild).not.toHaveBeenCalled();
      expect(service._tcContainers.length).toBe(0);
    });

    it('setDebug() should enable logging when set to true', () => {
      service.setDebug(true);

      spyOn(console, 'log');

      // Trigger some logging
      service.debug_logger('log message');

      // Assertions to check if logging methods are called
      expect(console.log).toHaveBeenCalledWith('log message');
    });

    it('setDebug() should disable logging when set to false', () => {
      service.setDebug(false);

      spyOn(console, 'log');

      // Trigger some logging
      service.debug_logger('log message');

      // Assertions to check that logging methods are not called
      expect(console.log).not.toHaveBeenCalled();
    });

    it('setTcVar() should set a variable', async () => {
      windowRef = TestBed.inject(WindowRef);

      // Input variables
      const tcKey = 'someKey';
      const tcVar = 'someValue';

      // Call function
      service.setTcVar(tcKey, tcVar);

      // Assertions
      expect(windowRef.nativeWindow.tc_vars[tcKey]).toBe(tcVar);
    });

    it('setTcVars() should set multiple variables at once', async () => {
      // Input variables
      const vars = {
        key1: 'value1',
        key2: 'value2'
      };

      // Mock
      spyOn(service, 'setTcVar').and.resolveTo();
      spyOn(service, 'debug_logger').and.resolveTo();

      // Call function
      service.setTcVars(vars);

      // Assertions
      expect(service.debug_logger).toHaveBeenCalledWith('setTcVars', vars);
      expect(service.setTcVar).toHaveBeenCalledWith('key1', 'value1');
      expect(service.setTcVar).toHaveBeenCalledWith('key2', 'value2');
      expect(service.setTcVar).toHaveBeenCalledTimes(2);
    });

    it('getTcVar() should return a value if it is available and throw an error otherwise', () => {
      // Input variables
      const tcKeyAvailable = 'key1';
      const tcKeyNotAvailable = 'key2';

      // Mock
      windowRef.nativeWindow.tc_vars[tcKeyAvailable] = 'value1';
      spyOn(service, 'debug_logger').and.resolveTo();

      // Call function
      const value1 = service.getTcVar(tcKeyAvailable);

      // Assertions
      expect(service.debug_logger).toHaveBeenCalledWith('getTcVar', tcKeyAvailable);
      expect(value1).toBe('value1');
      expect(() => {
        service.getTcVar(tcKeyNotAvailable);
      }).toThrow(new Error('[ngx-tag-commander]tc_var is undefined. Check that it\'s properly initialized'));
      expect(service.debug_logger).toHaveBeenCalledWith('getTcVar', tcKeyNotAvailable);
    });

    it('removeTcVar() should remove a variable if it exists', () => {
      // Input variable
      const tcKey = 'key1';

      // Mock
      windowRef.nativeWindow.tc_vars[tcKey] = 'value1';
      spyOn(service, 'debug_logger').and.resolveTo();

      // Call function
      service.removeTcVar(tcKey);

      // Assertions
      expect(service.debug_logger).toHaveBeenCalledWith('removeTcVar', tcKey);
      expect(windowRef.nativeWindow.tc_vars[tcKey]).toBe(undefined);
    });

    it('removeTcVar() should not remove a variable if does not exist', () => {
      // Input variable
      const tcKey = 'key1';
      const notAvailableKey = 'key2';

      // Mock
      windowRef.nativeWindow.tc_vars[tcKey] = 'value1';
      spyOn(service, 'debug_logger').and.resolveTo();

      // Call function
      service.removeTcVar(notAvailableKey);

      // Assertions
      expect(service.debug_logger).toHaveBeenCalledWith('removeTcVar', notAvailableKey);
      expect(windowRef.nativeWindow.tc_vars[tcKey]).toBe('value1');
    });

    it('reloadAllContainers() should reload all containers', async () => {
      // Input variable
      const options = {someOption: true};

      // Mocks
      const containerMock = jasmine.createSpyObj('container', ['reload']);
      windowRef.nativeWindow['tC'] = {
        container: containerMock
      };
      spyOn(service, 'debug_logger').and.resolveTo();

      // Call function
      service.reloadAllContainers({someOption: true});

      // Assertions
      expect(service.debug_logger).toHaveBeenCalledWith('Reload all containers ', options);
      expect(containerMock.reload).toHaveBeenCalledWith(options);
    });

    it('reloadContainer() should reload the specified container', async () => {
      // Input variables
      const siteId = '123';
      const containerId = '456';
      const options = {someOption: true};

      const containerName = `container_${siteId}_${containerId}`;

      // Mocks
      const containerMock = jasmine.createSpyObj(containerName, ['reload']);
      windowRef.nativeWindow['tC'] = {
        [containerName]: containerMock
      };
      spyOn(service, 'debug_logger').and.resolveTo();

      // Call function
      service.reloadContainer(siteId, containerId, options);

      // Assertions
      expect(service.debug_logger).toHaveBeenCalledWith('Reload container ids: ' + siteId + ' idc: ' + containerId,
        'with options: ', options);
      expect(containerMock.reload).toHaveBeenCalledWith(options);
    });

    it('captureEvent() should capture an event', async () => {
      // Input variables
      const eventLabel = 'onClick';
      const element = 'element';
      const data = {};

      // Mocks
      const eventMock = jasmine.createSpyObj('event', ['onClick']);
      windowRef.nativeWindow['tC'] = {
        event: eventMock
      };
      spyOn(service, 'debug_logger').and.resolveTo();

      // Call function
      service.captureEvent(eventLabel, element, data);

      // Assertions
      expect(service.debug_logger).toHaveBeenCalledWith('captureEvent', eventLabel, element, data);
      expect(eventMock.onClick).toHaveBeenCalledWith(element, data);
    });

  });

  describe('', () => {

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        providers: [
          TagCommanderService,
          {provide: WindowRef, useClass: MockWindowRefNoTcVars}
        ]
      });
      service = TestBed.inject(TagCommanderService);
      windowRef = TestBed.inject(WindowRef);
    });

    it('setTcVar() should throw an error if tc_vars property is not defined', async () => {
      // Input variables
      const tcKey = 'someKey';
      const tcVar = 'someValue';

      // Assertions
      expect(() => {
        service.setTcVar(tcKey, tcVar);
      }).toThrow(new Error('[ngx-tag-commander] setTcVar failed because no window.tc_vars was found. Did you initialize it?'));

    });
  });
});
