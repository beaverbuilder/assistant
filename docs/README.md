# Assistant Developer Documentation

- [Installation](#installation)
- [NPM Commands](#npm-commands)
- [Frontend Code](#frontend-code)
    - [src/apps](#srcapps)
    - [src/system](#srcsystem)
    - [src/fluid](#srcfluid)
    - [src/render](#srcrender)
- [Backend Code](#backend-code)
    - [backend/src/Controllers](#backendsrccontrollers)
    - [backend/src/Data](#backendsrcdata)
    - [backend/src/Hooks](#backendsrchooks)
    - [backend/src/PostTypes](#backendsrcposttypes)
    - [backend/src/Providers](#backendsrcproviders)
    - [backend/src/System](#backendsrcsystem)
    - [backend/templates](#backendtemplates)
    - [backend/tests](#backendtests)
- [Translation](#translation)

## Installation
After cloning the repo you will need to build the js and css bundles before the plugin will display. You can do that by:

```
cd /to/your/repo/folder
npm install
npm run build
```

## NPM Commands
Use the following npm commands after cloning the repo to work on the project:

`npm run build` - Build production files.

`npm run build:dist` - Build the plugin at wp-content/dist.

`npm run dev` - Build development files and watch for changes.

`npm run test` - Run unit tests and linters.

`npm run fix` - Attempt to fix errors caught by linters.

## Frontend Code
Frontend Assistant code makes heavy use of React, Redux, and React Router. Whenever possible, React hooks and function components are preferred over class components.

As Assistant is designed as an app platform, the following directories are built to be standalone bundles. This is important to keep in mind when importing from one bundle to another. For example, in the system bundle you can import using `import from 'lib'` because `lib` is in the system bundle. However, when creating an app you would instead import using `import from 'assistant/ui'` because you are in the `apps` bundle. Please see the webpack config for a complete list of entry points and paths.

### src/apps
The apps directory is where all core apps live. To create an app, create a new directory and import it in the apps index file.

**Registering an App**

Below is the bare minimum required to register an app.

```
import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import { App } from './app'

registerApp( 'fl-example', {
	label: __( 'Example' ),
	root: App,
} )
```

Additional properties for registering an app are shown below and more will likely be added in the future.

```
registerApp( 'fl-example', {
	label: __( 'Example' ),
	root: App,
	icon: App.Icon,
	accent: {
		color: '#16C8E1',
	},
	search: {
		label: __( 'Example' ),
		priority: 100,
		route: ( keyword, number, offset ) => {
			return addQueryArgs( 'fl-assistant/v1/example', {
				keyword,
				number,
				offset,
			} )
		},
		format: items => {
			return items.map( item => ( {
				...item,
				label: item.meta,
			} ) )
		},
		detail: {
			component: Page.Example,
			path: '/example/:id',
			pathname: item => {
				return `/example/${ item.id }`
			},
		},
	},
	state: { ... },
	actions: { ... },
	reducers: { ... },
	selectors: { ... },
	effects: { ... },
} )
```

**App State**

As shown above, each app can have its own state, actions, reducers, selectors, and effects. Whenever app state is defined, a Redux store will be created for your app and can be accessed with functions such as `useAppState( 'fl-example' )` or `getAppActions( 'fl-example' )`. Please see `system/store/app` for a full list of app store functions.

In addition to managing your app's state, the app store will also be saved to local storage allowing data to persist between page views.

### src/system
The system bundle is the headless foundation for the Assistant application. It is responsible for exposing the public API for registering apps. This public API is available in the global space at `FL.Assistant`. This bundle contains the following directories...

**config**

The config directory contains any configuration code for the system. It currently contains `sections` which are used to register the various page and form sections in the apps.

**data**

The data directory contains all of the Redux data stores for the Assistant system. Please see each store's index file for a list of functions for working with the stores. Remember, `app` stores are created for you when you register state for your app. Data functions exposed on the global namespace can be accessed outside of Assistant using `FL.Assistant.data`.

**ui**

The ui directory contains all of the React components available to Assistant apps. These can be anything from basic buttons to complex form hooks. These can be imported outside of the system bundle (e.g. in your apps) using `import from 'assistant/ui'`. If you create a component in your app and feel like the entire system could benefit from it, move it here! Components exposed on the global namespace can be accessed outside of Assistant using `FL.Assistant.ui`.

**utils**

The utils directory contains everything else that isn't a system component or data store. Utils can be anything from simple functions to full blown registries like our Redux store registry. Utils exposed on the global namespace can be accessed outside of Assistant using `FL.Assistant.utils`.

### src/fluid
The FLUID endpoint creates a bundle from the @beaverbuilder/fluid package. This is a library of components and data helpers being shared between Assistant and Beaver Builder. Both contain a copy so they can function separately but when both are present they share one copy. The fluid library can be accessed on the global `FL.UID` object. The fluid library provides several vendor libraries.

* React Router Dom - Provides navigation behaviors for Assistant and Beaver Builder panels.
* Redux - used to create global observable data stores.
* Classnames - used to help create class lists based on logic.
* Camelcase - use to properly camelcase strings.

These vendor libraries are available at `FL.UID.vendors` and are mapped to their package names using webpack externals. For example:
```
import classname from 'classnames'
```
This will import the copy of classnames found at `FL.UID.vendors.classnames`.

### src/render
The render bundle renders the overall Assistant application into the page. It also registers an alternate version of Assistant as a Beaver Builder panel when inside the BB editing UI. Most developers building apps or components won't need to touch this code.

## Backend Code
All backend PHP code should use the `FL\Assistant` namespace and follow the WordPress coding standards. Be sure to run PHPCS and PHPCBF before pushing to be sure your code follows those standards.

### backend/src/Controllers
The Controllers directory contains classes for working with the WordPress REST API.

### backend/src/Data
The Data directory contains classes for retrieving and transforming data. If you introduce a new type of data, please create the relevant Repository and Transformer as needed.

### backend/src/Hooks
The Hooks directory contains classes for working with WordPress actions and filters. If you need a new hook, create a class for it here and register it in the provider as shown below.

### backend/src/PostTypes
The PostTypes directory contains classes for registering new WordPress post types.

### backend/src/Providers
The Providers directory contains classes for bootstrapping different parts of the system such as data or hooks. For example, after you create a new hook class, you can register it in the `HooksServiceProvider`.

### backend/src/System
The System directory contains many of the base classes for Assistant's backend. It is also where the main plugin setup begins. Most of the time you will not need to touch this directory.

### backend/templates
The templates directory contains PHP templates for outputting HTML in your classes.

### backend/tests
The tests directory contains PHP unit tests for Assistant's backend.

## Translation
All frontend code should be translated when appropriate using the functions provided in the `@wordpress/i18n` package. All backend code should be translated using core WordPress translation functions.
