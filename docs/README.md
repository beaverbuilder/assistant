# Assistant Developer Documentation

- [Installation](#installation)
- [NPM Commands](#npm-commands)
- [Frontend Code](frontend-code)
-- [src/apps](src-apps)
-- [src/system](src-system)
-- [src/ui](src-ui)
-- [src/fluid](src-fluid)
- [Backend Code](backend-code)
-- [backend/src/Controllers](backend-src-controllers)
-- [backend/src/Data](backend-src-data)
-- [backend/src/Hooks](backend-src-hooks)
-- [backend/src/PostTypes](backend-src-posttypes)
-- [backend/src/Providers](backend-src-providers)
-- [backend/src/System](backend-src-system)
-- [backend/templates](backend-templates)
-- [backend/tests](backend-tests)

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
The frontend js for Assistant is divided into several separate bundles.

### src/system
The system bundle is the headless foundation for the Assistant application. It is responsible for exposing the public API for registering apps. This public API is available in the global space at `FL.Assistant`.

### src/apps
The apps bundle registers a collection of apps into the system.

### src/ui
The UI bundle renders the overall Assistant application into the page. It also registers an alternate version of Assistant as a Beaver Builder panel when inside the BB editing UI.

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
