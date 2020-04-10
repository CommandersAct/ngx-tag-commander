# ngx-tag-commander

This service lets you integrate Tag Commander in your AngularX (2+) applications easily.
- [Official website](https://www.commandersact.com/fr/produits/tagcommander/)

## Features

 - Automatic page tracking
 - Set & Get Variables
 - Reloading Containers
 - Event catching
 - Multiple containers

## Installation and Quick Start
The quick start is designed to give you a simple, working example for the most common usage scenario. There are numerous other ways to configure and use this library as explained in the documentation.

### 1- Installation:
You can install the module from a package manager of your choice directly from the command line

```
# NPM
npm i ngx-tag-commander
```

In your application, declare the ngx-tag-commander module dependency. in your app module:

```typescript
import { NgxTagCommanderModule } from 'ngx-tag-commander';
```

### 2- In your application, declare dependency injection:

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

Congratulations! ngx-tag-commander is ready 

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
    ...
    tcService.trackRoutes(true);
    ...
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
          // Data Layer options if needed
        }
      },
      {
        'idc':  11,
        'ids': 4055,
      }]
    }
  },
 ];
```
This will reload the specified containers, with the specified options

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
## Retrieve or Delete Variables

In order to retrieve or delete container variables you first need to instanciate the data layer.
Import ```WindowRef``` in your module

```js
import { WindowRef } from 'ngx-tag-commander';
```

Then in your constructor : 

```js
import { WindowRef } from 'ngx-tag-commander';

constructor(private tcService: TagCommanderService, private windowRef :WindowRef) {
    windowRef.nativeWindow.tc_vars = {};
	...
	// retrieve container variables
    tcService.getTcVar("your_var_key"));
    // remove variable
    tcService.removeTcVar('your_var_key')
  }
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
In your app.module.ts on one of your routes please write tcInclude inside the data part. You also need to state the event Page in the options.

```js
var idc = '1234';
var ids = '1234';
var options = {
    events: {page: [{},{}]},
    // ...
    // other options
    // ...
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
          // Data Layer options
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
			// Data Layer options
        }
      }]
    }
  }
];
```
### Exclusions

You can state an exclusion array to your options object like below :

```js
tcInclude: [{
	idc:  12,
	ids: 4056,
	options: {
	    exclusions: [
        "datastorage",
        "deduplication",
        "internalvars",
        "privacy"
    	]
	}
}]

```
Please see Tag Commander documentation for other options


## Sample app
To help you with your implementaiton we provided a sample application. to run it
```
ng serve
or
npm start
```
then go to [http://localhost:4200/](http://localhost:4200/)


## Development

After forking you will need to run the following from a command line to get your environment setup:

1. ```yarn install```

After install you have the following commands available to you from a command line:

Build the library by :

 ```ng build NGX-TAG-COMMANDER ```

## Documentation

- ```TagCommanderService.addContainer( id: string, uri : string, node : string )```

	- id : id the id the script node will have
	- uri : uri the source of the script
	- node : the node on witch the script will be placed, it can either be head or body

- ```TagCommanderService.removeContainer( id : string )```

	- id : id the id the script node will have


- ```TagCommanderService.setDebug( debug : bool )```

	- debug : will display the debug messages if true


- ```TagCommanderService.trackRoutes( b : bool )```

 - b : will read routes if set to true



- ```TagCommanderService.setTcVar( tcKey : string, tcVar : any )```

	set or update the value of the var

	- tcKey : key in the data layer
	- tcVar : content


- ```TagCommanderService.setTcVars( vars : any )```

	set your variables for the different providers, when called the first time it instantiate the external variable

- ```TagCommanderService.getTcVar( tcKey : string )```

	get the value of the container variable
	
	- tcKey : key 


- ```TagCommanderService.removeTcVar( varKey : string )```

	removes the var by specifying the key
	
	- varKey : key of the variable


- ```TagCommanderService.reloadAllContainers( options : object )```

	Reload all containers

	- options to give to the ```tC.container.reload(options)``` function

- ```TagCommanderService.reloadContainer( ids : number, idc : number, options : object )```

	Reload the specified container
	- ids : Site Id
	- idc : Container Id
	- options : options for the function ```tC[containerId].reload(options)```

- ```TagCommanderService .captureEvent( eventLabel : string , element : HTMLElement, data : object )```

	Set a TagCommander Event
	- eventLabel : name of the event
	- element : Dom Element where the event is attached
	- data : data you want to send


## License

As AngularJS itself, this module is released under the permissive [MIT License](http://revolunet.mit-license.org). Your contributions are always welcome.


