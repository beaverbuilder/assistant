# Assistant Developer Documentation

- [Installation](#installation)
- [NPM Commands](#npm-commands)
- [Frontend Code](#frontend-code)
    - [src/apps](#src-apps)
    - [src/system](#src-system)
    - [src/ui](#src-ui)
    - [src/vendors](#src-vendors)
- [Backend Code](#backend-code)
    - [backend/src/Controllers](#backend-src-controllers)
    - [backend/src/Data](#backend-src-data)
    - [backend/src/Hooks](#backend-src-hooks)
    - [backend/src/PostTypes](#backend-src-posttypes)
    - [backend/src/Providers](#backend-src-providers)
    - [backend/src/System](#backend-src-system)
    - [backend/templates](#backend-templates)
    - [backend/tests](#backend-tests)
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
...

### src/ui
...

### src/vendors
...

##Backend Code
...

### backend/src/Controllers
...

### backend/src/Data
...

### backend/src/Hooks
...

### backend/src/PostTypes
...

### backend/src/Providers
...

### backend/src/System
...

### backend/templates
...

### backend/tests
...

## Translation
All frontend code should be translated when appropriate using the functions provided in the `@wordpress/i18n` package. All backend code should be translated using core WordPress translation functions.
