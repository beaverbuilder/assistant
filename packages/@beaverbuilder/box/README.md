# @beaverbuilder/box

This is a tiny (2kb) react component that makes creating container elements really quick. There is no stylesheet required, all styles are applied using js. The only dependency is react.

```
import b from '@beaverbuilder/box'

const MyComponent = () => (
	<>
		{ /* Use as any html tag */ }
		<b.div />

		{ /* Quick Padding */ }
		<b.span pad />
		<b.div padY={20} />
		<b.div pad="sm" />
		<b.div padX="30px" padY="40px" />

		{ /* Aspect Ratio Boxes */ }
		<b.div ratio="1:2">Aspect Ratio Box</b.div>
		<b.div ratio="video" />

		<b.square /> { /* Same as `<b.div ratio="square" />` */ }
		<b.poster /> { /* Shorthand for a 3:4 aspect ratio div */ }

		{ /* Flexbox Shorthand */ }
		<b.span column />
		<b.row gap={10} />
		<b.column tag="section" />
	</>
)
```

## Flexbox
Since flexbox is used so frequently when constructing UI, the box component has a few shorthand ways to create flex containers. You can use `b.column` and `b.row` to create flexbox div elements quickly.

```
<b.column>I am a `display: flex; flex-direction: column` container element.</b.column>
<b.column tag="span" />
```
You can use the `tag="span"` prop to create a column or row with something other than a div element.

The `gap` prop is a shorthand for setting `style={ { gap: '5px' } }`. Be aware of browser support for this property - at the present the `gap` property for flexbox is supported in Chrome, Firefox, Edge(Chromium) and the Safari Technology Preview. If supported, direct child elements with have the specified space (gap) between each of them.
<b.row gap={5}>
	<button>Button One</button>
	<button>Button Two</button>
	<button>Button Three</button>
</b.row>
```

## Error Boundaries
Any box can optionally contain an error boundary by setting the `errorBoundary` prop. This prevents js errors from bubbling up to the parent elements.

```
	<b.div errorBoundary>
		<SomeShadyComponent />
	</b.div>
```
The error will be caught within the div and will display the error message. You can optionally provide a fallback component that will present in the event of an error.
```
const MyCustomFallback = ( { error } ) => (
	<>
		<mark>We have a problem!</mark>
		<code>{ error.message }</code>
	</>
)
const MyUI = () => (
	<b.div errorBoundary={ MyCustomFallback }>
		<SomeShadyComponent />
	</b.div>
)
```

## Peer Dependencies
* React
