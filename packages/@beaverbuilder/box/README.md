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

## Upcoming Features
- Add an error boundary when given an `error={<Component />}` prop.
- Common placeholder components that display when children prop is empty.

## Peer Dependencies
* React
