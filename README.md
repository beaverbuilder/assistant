# Assistant

[![Master Build Status](https://travis-ci.org/beaverbuilder/assistant.svg?branch=master)](https://travis-ci.org/beaverbuilder/assistant)

## Issues & Pull Requests
This project is in the early stages of development. We are also participants in the WordCamp Orange County Plugin-a-Palooza competition. This competition requires the project to only have 3 participants (including non-code contributors). Because of this, for the time being we aren't accepting any public issues or pull requests. We will be after the competition completes. Thanks for your patience there. In the meantime you can download [the plugin](https://wordpress.org/plugins/assistant/) from the [WordPress Plugin repo](https://wordpress.org/plugins/assistant/).

## Installation
After cloning the repo you will need to build the js and css bundles before the plugin will display. You can do that by:

```
cd /to/your/repo/folder
npm install
npm run build
```

## Development
Use the following npm commands after cloning the repo to work on the project:

`npm run dev` - Build development files and watch for changes.

`npm run test` - Run unit tests and linters.

`npm run fix` - Attempt to fix errors caught by linters.
