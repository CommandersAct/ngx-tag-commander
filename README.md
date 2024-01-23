# ngx-tag-commander

This service lets you integrate CommandersAct's tag container in your Angular applications easily.
- [Official CommandersAct's tag container website](https://www.commandersact.com/products/tag-management/)

## Table of Contents
- [Features](#features)
- [Angular Version Compatibility](#angular-version-compatibility)
- [Installation and Quick Start](#installation-and-quick-start)
- [Methods](#methods)
  - [Usage in component](#usage) 
  - [Container Management](#container-management)
  - [Variable Management](#variable-management)
  - [Events](#events)
  - [Reloading Containers](#reloading-containers)
- [Server-side Rendering (SSR)](#server-side-rendering)
- [API Documentation](#api-documentation)
- [Sample App](#sample-app)
- [Development](#development)
- [License](#license)

## Features <a name="features"></a>

 - Automatic page tracking
 - Set & Get Variables
 - Reloading Containers
 - Event catching
 - Multiple containers

## Angular Version Compatibility <a name="angular-version-compatibility"></a>
The following table gives an overview of which version of `ngx-tag-commander` to use depending on your project's Angular version.
- ✅: supported
- ⚠️: not explicitly built for but might be working
- ❌: not supported

| Angular version | `ngx-tag-commander@3.0.0` (current) | `ngx-tag-commander@2.0.0` | `ngx-tag-commander@1.3.1` |
|---------------------| ---- | ---- | ---- |
| `17.x.x`              | ✅ | ⚠️ | ❌ |
| `16.x.x`              | ✅ | ⚠️ | ❌ |
| `15.x.x`              | ❌ | ✅ | ❌ |
| `14.x.x `             | ❌ | ✅ | ❌ |
| `13.x.x`              | ❌ | ✅ | ❌ |
| `12.x.x`              | ❌ | ✅ | ❌ |
| `11.x.x`              | ❌ | ❌ | ⚠️ |
| `10.x.x`              | ❌ | ❌ | ⚠️ |
| `9.x.x`               | ❌ | ❌ | ⚠️ |
| `8.x.x`               | ❌ | ❌ | ⚠️ |
| `7.x.x `              | ❌ | ❌ | ✅ |

## Installation and Quick Start <a name="installation-and-quick-start"></a>

The quick start is designed to give you a simple, working example for the most common usage scenario. There are numerous other ways to configure and use this library as explained in the documentation.

### 1. Before installing the plugin

The plugin doesn't replace the standard setup of a container because you may need to use the containers outside the plugin.

Initialize your datalayer so that it's ready for the container and plugin, without losing any data. Do it as soon as possible on your website like in a `<script>` block in the head of your webapp.

```javascript
tc_vars = []
```

### 2. Installation:

You can install the module from a package manager of your choice directly from the command line

```sh
npm i ngx-tag-commander
```

### 3. In your application app.module.ts, declare dependency injection:

```typescript
...
import { WindowRef } from 'ngx-tag-commander';
...
import { NgxTagCommanderModule } from 'ngx-tag-commander';

@NgModule({
    ...
    imports: [
        ...
        NgxTagCommanderModule
        ...
    ],
    providers: [WindowRef],
    ...
})
```

### 4. Add your tag containers and start tracking:

```typescript
import { TagCommanderService } from 'ngx-tag-commander';
...

export class AppModule {
    constructor(tcService: TagCommanderService) {
        ...
        Promise.all([
            tcService.addContainer('container_body', '/assets/tag-commander-body.js', 'body'),// Replace URL by the one of your container
            tcService.addContainer('container_head', '/assets/tag-commander-head.js', 'head')
        ]).then(() => {
            //Insert the rest of your code here
        });
        ...
    }
}
```

You are now ready to use the ngx-tag-commander plugin.

## Methods <a name="methods"></a>

Some methods are asynchronous. If you want to ensure that a method has been executed before continuing, you can use the await keyword. Please check the function definition to see if it is asynchronous.

### Usage in component <a name="usage"></a>

```typescript
import { TagCommanderService } from 'ngx-tag-commander';
...

export class MyComponent {
    constructor(private tcService: TagCommanderService) {
      ...
    }
}
```

### Container Management <a name="container-management"></a>

```typescript
// Adding a container
await tcService.addContainer('my-custom-id', '/url/to/container.js', 'head');

// Removing a container
tcService.removeContainer('my-custom-id');
```

### Variable Management <a name="variable-management"></a>

```typescript
// Set variables
tcService.setTcVars({ env_template : "shop", env_work: 'dev', ... });

// Update a single variable, you can also overwrite existing variables
tcService.setTcVar('env_template', 'super_shop');

// Get a variable
const myVar = wrapper.getTcVar('env_template');

// Remove a variable
tcService.removeTcVar('env_template');
```

#### Set variables using `SetTcVarsDirective`
You can also use the directive `SetTcVarsDirective` to set variables directly on any html node:
```html
<div [tcSetVars]="{ env_template: defaultEnv }"></div>
```

### Events <a name="events"></a>

- Refer to the [base documentation on events](https://community.commandersact.com/tagcommander/user-manual/container-management/events) for an understanding of events in general.
```typescript
// Triggering an event
// eventLabel: Name of the event as defined in the container
// htmlElement: Calling context. Usually the HTML element on which the event is triggered, but it can be the component.
// data: event variables
tcService.captureEvent(eventLabel, element, data);
```
#### Trigger an event using `TcEventDirective`
- Events can also be triggered by using the `TcEventDirective`. The event will be triggered when clicking the button.
```html
<button [tcEvent]="'test'" [tcEventLabel]="'test'" [tcEventObj]="cartItems">Add Items in ShopCart</button>
```

### Reloading Containers <a name="reloading-containers"></a>

#### 1 Manual Reload
Update your container after any variable change.
```typescript
tcService.reloadContainer(sideId, containerId, options);
```

#### 2. On Route Change
Automatic reload can be performed on route change.
1. Enable the service's route tracking in the app configuration:
```typescript
tcService.trackRoutes(true);
```
2. Add the `tcInclude` property to your routes:
```typescript
const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
    data: {
      tcInclude: [{
        idc: 12,
        ids: 4056,
        options: {...}
      }]
    }
  },
  {
    path: 'home',
    component: IndexPageComponent,
    data: {
      tcInclude: [{
        idc: 12,
        ids: 4056,
        options: {...}
      }]
    }
  }
];
```
#### Exclusions //TODO check if still relevant

You can state an exclusion array to your options object like below:

```typescript
tcInclude: [{
    idc: 12,
    ids: 4056,
    options: {
        exclusions: [
            'datastorage',
            'deduplication',
            'internalvars',
            'privacy'
        ]
    }
}];
```
Please see the [container's documentation](https://community.commandersact.com/tagcommander/) for other options.

## Server-side Rendering (SSR) <a name="server-side-rendering"></a>
`ngx-tag-commander` fully supports Server-side rendering (SSR), as it comes with an internal check to run the code only on the client-side.
This is important as the wrapper is interacting with the DOM objects `document` and `window`, which are not available on the server.

## API Documentation <a name="api-documentation"></a>

- ```TagCommanderService.addContainer(id: string, uri: string, node: string): Promise<void>```
  - `id`: The id the script node will have
  - `uri`: The source of the script
  - `node`: The node on witch the script will be placed. Can either be `head` or `body`
  - Returns a promise which is resolved when the container has been loaded.
- ```TagCommanderService.removeContainer(id: string): void```
  - `id`: The id of the container to remove
- ```TagCommanderService.setDebug(debug: boolean): void```
  - `debug`: TagCommanderService will display debug messages if set to `true`
- ```TagCommanderService.trackRoutes(b : boolean): void```
  - `b`: TagCommanderService will reload containers on route change if set to `true`
- ```TagCommanderService.setTcVar(tcKey: string, tcVar: any): void```
  - `tcKey`: Key of the variable to set or update
  - `tcVar`: Data of the variable
- ```TagCommanderService.setTcVars(vars: object): void```
  - `vars`: Object containing the multiple variables to set or update
- ```TagCommanderService.getTcVar(tcKey: string): any```
  - `tcKey`: Key of the variable to get
- ```TagCommanderService.removeTcVar(varKey: string): void```
  - `varKey`: Key of the variable to remove
- ```TagCommanderService.reloadAllContainers(options: object): number```
  - `options`: Options passed to ```tC.container.reload(options)```
- ```TagCommanderServicereloadContainer(siteId: string, containerId: string, options: object): number```
  - `siteId`: Site id
  - `containerId` : Container Id
  - `options`: Options passed to```tC[containerId].reload(options)```
- ```TagCommanderService.captureEvent(eventLabel: string, element: HTMLElement, data: object)```
  - `eventLabel`: Name of the event
  - `element`: DOM element where the event is attached
  - `data`: Data sent with the event

## Sample app <a name="sample-app"></a>
To help you with your implementation we provided a sample application. To run it clone the repo and ensure you have Node.js >=18.x.x installed. Then run in the base folder:
1. ```npm install```
2. ```npm start```

After that, visit [http://localhost:4200/](http://localhost:4200/).


## Development <a name="development"></a>

The implementation of the `ngx-tag-commander` library can be found in `/projects/ngx-tag-commander`. Changes can be tested using the sample app described above.

Useful commands (ensure you have Node.js >=18.x.x installed & run in the base folder):
- Setup development environment: ```npm install```
- Run sample app: ```npm start```
- Run linter: ```npm run lint```
- Run library tests: ```npm run test```
- Run sample app tests: ```npm run test-sample-app```
- Build library: ```npm run build```

## License <a name="license"></a>
As Angular itself, this module is released under the permissive [MIT License](http://revolunet.mit-license.org). Your contributions are always welcome.


