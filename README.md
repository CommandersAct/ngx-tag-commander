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

# NPM
npm i ngx-tag-commander
```

In your application, declare the ngx-tag-commander module dependency. in your app module:

```typescript
import { NgxTagCommanderModule } from 'ngx-tag-commander';
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
import { TagCommanderService } from 'ngx-tag-commander';
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

Congratulations! [ngx-tag-commander](https://github.com/TagCommander/ngx-tag-commander) is ready 

## Declaring TagCommander in your Controller
```js
import { TagCommanderService } from 'ngx-tag-commander';
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
The `setVar` call allows to set your `tc_vars`.
```js
constructor(private tcService: TagCommanderService) {
    tcService.setTcVars({
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
      tcService.setTcVars({
      user_newcustomer : "true",
      });
    }
    // or set/update them individualy
    tcService.setTcVar('env_template', 'super_shop');

    // you can also remove a var
    tcService.removeTcVar('env_template');
}
```
### As a directive
You can use the directive tcSetVars direcly on any html node
```html
<html-element class="sm-button green-500" [tcSetVars]="{'env_language': 'fr'}"></html-element>

<!-- other exemple -->
<!-- defaultLanguage being an attribut of your component -->
<div class="sm-button green-500" [tcSetVars]="{'env_template': defaultEnv}"></div>
```

## Capture Events
```js
constructor(private tcService: TagCommanderService) {
    // {string} eventLabel the name of your event
    let eventLabel=  'NameEvent';
    // {HTMLElement} element the HTMLelement on witch the event is attached
    let element = 'button';
    // {object} data the data you want to transmit
    let data = {"env_language": 'theEventVar'};
  
    tcService.captureEvent(eventLabel,element, data);
   }
```
### As a directive
```html
<button [tcEvent]="'test'" [tcEventLabel]="'test'" [tcEventObj]="cartItems"> Add Items in ShopCart </button>

```

## How to reload your container
In your app.module.ts on one of your routes please write tcInclude inside the data part

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
this.tcService.reloadContainer(ids, idc, options);
// or you can reload all the containers
this.tcService.reloadAllContainers(options);
```
## Automatic reload of your containers by tracking Routes
### The configuration

you need to set tcService.trackRoutes(true); to true in your app configuration

```js
const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
    data: {
      tcInclude: [{
        idc:  12,
        ids: 4056,
        options: {
          exclusions: ["datastorage", "deduplication"]
        }
      }]
    }
  },
  {
    path: 'home',
    component: IndexPageComponent,
    data: {
      tcInclude: [{
        idc:  12,
        ids: 4056,
        options: {
          exclusions: ["datastorage", "deduplication"]
        }
      }]
    }
  }
]
```
> to be updated
```js
export class AppModule { 
  constructor(tcService: TagCommanderService) {
  tcService.trackRoutes(true);
  }
}
```
If you don't set the TagCommanderProvider.trackRoutes(true); (or you set it to false) you will have to reload your container manually

```js
// somewhere in your controller
// reload a specifique container
ngOnInit() {
this.tcService.reloadContainer(ids, idc, options);
// or you can reload all the containers
this.tcService.reloadAllContainer(options);
 }
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
