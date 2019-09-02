# Config

This section is for general setup like registrations. The config directory is imported after all other areas of the api (lib, system, utils) have been imported so everything in the system api should be available.

## Registering Sections

Sections can be registered to appear on different types of screens. This works essentially like registering metaboxes in WP. To register a section you'll use the function `registerSection`.

Function signature
`registerSection( <String>handle, <Object>config )`

You can import the function either from `store` if you're within the system bundle or (as a const) from `FL.Assistant.data` from another bundle. For convenience `FL.Assistant.data` is aliased to `assistant/data` within the Assistant project.

```
// From within the system bundle, you can import directly from store.
import { getSystemActions } from 'store'
const { registerSection } = getSystemActions()

// OR
// from outside of the system bundle
const { registerSection } = FL.Assistant.data

// OR
// for convenience, the `FL.Assistant.data` is aliased using webpack.
// This requires that webpack have externals set up which the Assistant project does.
import { getSystemActions } = 'assistant/data'
const { registerSection } = getSystemActions()
```

One you have the register function, you can add a new section like this.
```
registerSection( 'fl-comment-details', {
	label: __( 'Details' ),
	location: {
		type: 'comment',
	},
	render: ({ comment }) => {
		const { author, authorIP, authorEmail, date } = comment
		return (
            <>
                Render your (react) section content here.
            </>
		)
	},
} )
```

## Config Object
The section config object expects several keys. Some of them are optional.

* Label - optional. The text of the section title.

* Location <Object> - describes the screen and conditions in which this section is intended to appear.
    * type - the handle given by the screen rendering sections. These will be things like `home` and `post`. This key can also be given an array of values like `['post', 'user', 'comment']`.
    * tab - if the screen supports tabs, each tab will have a different tab key specified. The default tab should generally be `''` so this can be left out and the section will be rendered on the first tab.

* Render <Function> - a function that returns a react component tree. This is the content for your section.
