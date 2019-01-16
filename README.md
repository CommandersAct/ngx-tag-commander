# ngx-tag-commander

This service lets you integrate Tag Commander in your AngularX (2+) applications easily.
- [Official website](https://www.commandersact.com/fr/produits/tagcommander/)

## Features

 - automatic page tracking
 - event catching
 - multiple containers

## Installation and Quick Start
The quick start is designed to give you a simple, working example for the most common usage scenario. There are numerous other ways to configure and use this library as explained in the documentation.

### 1- Installation:
You can install the module from a package manager of your choice directly from the command line

```sh
# Bower
bower install ngx-tag-commander

# NPM
npm i ngx-tag-commander
```

Or alternatively, grab the dist/index.ts and include it in your project

In your application, declare the ngx-tag-commander module dependency. in your app module:

```typescript
import { NgxTagCommanderModule } from './ngx-tag-commander/ngx-tag-commander.module';
```

### 2- In your application, declare dependency injection:

```typescript
@NgModule({
    ...
    imports: [
        ...
        NgxTagCommanderModule
    ],
    ..
})

```

### 3- add your Tag commander containers and start tracking:

```JavaScript
import { TagCommanderService } from 'tag-commander';
...
export class AppModule {
  constructor(tcService: TagCommanderService) {
    ...
    tcService.addContainer('container_body', '/path/to/your/tag-commander.js', 'body');
    tcService.addContainer('container_head', '/path/to/your/other/tag-commander.js', 'head');
    ...
  }
}
```

Congratulations! [angularjs-tag-commander](https://github.com/TagCommander/angular-tag-commander) is ready 

## Declaring TagCommander in your Controller
```js
import { TagCommanderService } from './ngx-tag-commander/tag-commander.service/tag-commander.service';
...
export class MyComponent {
constructor(private tcService: TagCommanderService) { }
}
```

## Declaring the route tracking
first configure the module to track routes in app.module
```js
export class AppModule {
  constructor(tcService: TagCommanderService) {
    tcService.trackRoutes(true);
  }
}
```
then in your routes:
```js
const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
    data: {
      tcInclude: [{
        'idc':  12,
        'ids': 4056,
        options: {
          exclusions: ["datastorage", "deduplication"]
        }
      },
      {
        'idc':  11,
        'ids': 4055,
      }]
    }
  },
```
this will reload the specified containers, with the specified options

## Set Vars
### In a controller
The `setVar` call allows to set your `tc_vars`.
```js
TagCommanderService.setTcVars({
    env_template : "shop",
    env_work : "dev",
    env_language : "en",
    user_id : "124",
    user_logged : "true",
    user_age: "32",
    user_newcustomer : "false",
});
// you can also override some varible
if (isNewUser) {
    TagCommanderService.setTcVars({
        user_newcustomer : "true",
    });
}
// or set/update them individualy
TagCommanderService.setTcVar('env_template', 'super_shop');

// you can also remove a var
TagCommanderService.removeTcVars('env_template');
}
```
### As a directive
You can use the directive tcSetVars direcly on any html node
```html
<html-element class="sm-button green-500" tc-set-vars='{"env_language": "fr"}'></html-element>

<!-- other exemples -->
<!-- defaultLanguage being an attribut of your component -->
<template class="sm-button green-500" tcSetVars="{'env_language': defaultLanguage}"></template>
<div class="sm-button green-500" tc-set-vars='{"env_language": $scope.default_language}'></div>
```
## Get Var
###In your controller
```js
let myVar = TagCommanderService.getTcVar('VarKey');
```

## Capture Events
### In a controller
```js
let eventId = '1234';
let data = '{"env_language": theEventVar}';

TagCommanderService.captureEvent(eventId, data);
```
### As a directive
```html
<button tcEvent="{'eventId': myEventId, 'data': {'env_language': envLanguage}}"> change to default language </button>

```

## How to reload your container
When you update your varible you also need to update your container to propagate the changes
```js
var idc = '1234';
var ids = '1234';
var options = {
    exclusions: [
        "datastorage",
        "deduplication",
        "internalvars",
        "privacy"
    ]
};
TagCommanderService.reloadContainer(ids, idc, options);
// or you can reload all the containers
TagCommanderService.reloadAllContainers(options);
```
## Automatic reload of your containers by tracking Routes
### The configuration

you need to set TagCommanderProvider.trackRoutes(true); to true in your app configuration

> to be updated
```js
TagCommanderService.trackRoutes(true);
```
then you can configure the your route by using the tcRealoadOnly option in your route configuration

```js

```
If you don't set the TagCommanderProvider.trackRoutes(true); (or you set it to false) you will have to reload your container manually

```js
// somewhere in your controller
// reload a specifique container
TagCommanderService.reloadContainer(ids, idc, options);
// or you can reload all the containers
TagCommanderService.reloadAllContainer(options);
```

## Sample app
To help you with your implementaiton we provided a sample application. to run it
```
ng serve
or
npm start
```
then go to [http://localhost:4200/](http://localhost:4200/)


## License

As AngularJS itself, this module is released under the permissive [MIT License](http://revolunet.mit-license.org). Your contributions are always welcome.

## Development

After forking you will need to run the following from a command line to get your environment setup:

1. ```yarn install```

After install you have the following commands available to you from a command line:
