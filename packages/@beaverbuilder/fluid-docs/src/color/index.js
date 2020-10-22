import React from 'react'
import { Layout } from '@beaverbuilder/fluid'

const ColorBlock = ( { value, style, ...rest } ) => (
	<div
		style={ {
			height: 40,
			background: value,
			padding: 10,
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			fontFamily: 'ui-monospace, monospace',
			...style,
		} }
		{ ...rest }
	/>
)

export default () => (
	<Layout.ContentBoundary>
		<h1>Color</h1>

		<h2>Grey Scale</h2>
		<p>The value scale offers a set of neutral colors in both opaque and transparent values that can be used to construct most UI elements in both dark and light color schemes. Each value can be accessed with the appropriate CSS custom property using the <code>var(--fluid-opaque-0)</code> syntax.</p>

		<div style={ { display: 'flex', border: '1px solid var(--fluid-line-color)', padding: '10 0' } }>
			<div style={ { flex: '1 1 auto' } }>
				<div style={ { color: 'var(--fluid-opaque-14)' } }>
					<ColorBlock value="var(--fluid-opaque-0)">--fluid-opaque-0</ColorBlock>
					<ColorBlock value="var(--fluid-opaque-1)">--fluid-opaque-1</ColorBlock>
					<ColorBlock value="var(--fluid-opaque-2)">--fluid-opaque-2</ColorBlock>
					<ColorBlock value="var(--fluid-opaque-3)">--fluid-opaque-3</ColorBlock>
					<ColorBlock value="var(--fluid-opaque-4)">--fluid-opaque-4</ColorBlock>
					<ColorBlock value="var(--fluid-opaque-5)">--fluid-opaque-5</ColorBlock>
					<ColorBlock value="var(--fluid-opaque-6)">--fluid-opaque-6</ColorBlock>
				</div>
				<div style={ { color: 'var(--fluid-opaque-0)' } }>
					<ColorBlock value="var(--fluid-opaque-7)" style={ { color: 'var(--fluid-opaque-14)' } }>--fluid-opaque-7 (middle grey)</ColorBlock>
					<ColorBlock value="var(--fluid-opaque-8)">--fluid-opaque-8</ColorBlock>
					<ColorBlock value="var(--fluid-opaque-9)">--fluid-opaque-9</ColorBlock>
					<ColorBlock value="var(--fluid-opaque-10)">--fluid-opaque-0</ColorBlock>
					<ColorBlock value="var(--fluid-opaque-11)">--fluid-opaque-1</ColorBlock>
					<ColorBlock value="var(--fluid-opaque-12)">--fluid-opaque-12</ColorBlock>
					<ColorBlock value="var(--fluid-opaque-13)">--fluid-opaque-13</ColorBlock>
					<ColorBlock value="var(--fluid-opaque-14)">--fluid-opaque-14 (white)</ColorBlock>
				</div>
			</div>
			<div style={ { flex: '1 1 auto' } }>
				<ColorBlock value="transparent" style={ { opacity: .5 } }>No Transparent 0</ColorBlock>
				<div style={ { background: 'linear-gradient( 90deg, black, black, white )', color: 'var(--fluid-opaque-14)' } }>
					<ColorBlock value="var(--fluid-transparent-1)" >--fluid-transparent-1</ColorBlock>
					<ColorBlock value="var(--fluid-transparent-2)" >--fluid-transparent-2</ColorBlock>
					<ColorBlock value="var(--fluid-transparent-3)" >--fluid-transparent-3</ColorBlock>
					<ColorBlock value="var(--fluid-transparent-4)" >--fluid-transparent-4</ColorBlock>
					<ColorBlock value="var(--fluid-transparent-5)" >--fluid-transparent-5</ColorBlock>
					<ColorBlock value="var(--fluid-transparent-6)" >--fluid-transparent-6</ColorBlock>
				</div>
				<ColorBlock value="transparent" style={ { opacity: .5 } } >No Transparent 7</ColorBlock>
				<div style={ { background: 'linear-gradient( 90deg, white, white, #aaa )', color: 'var(--fluid-opaque-0)' } }>
					<ColorBlock value="var(--fluid-transparent-8)" >--fluid-transparent-8</ColorBlock>
					<ColorBlock value="var(--fluid-transparent-9)" >--fluid-transparent-9</ColorBlock>
					<ColorBlock value="var(--fluid-transparent-10)" >--fluid-transparent-10</ColorBlock>
					<ColorBlock value="var(--fluid-transparent-11)" >--fluid-transparent-11</ColorBlock>
					<ColorBlock value="var(--fluid-transparent-12)" >--fluid-transparent-12</ColorBlock>
					<ColorBlock value="var(--fluid-transparent-13)" >--fluid-transparent-13</ColorBlock>
				</div>
				<ColorBlock value="transparent" style={ { opacity: .5 } } >No Transparent 14</ColorBlock>
			</div>
		</div>

		<h2>Blue Scale</h2>
		<p>The blue scale consists of color constant variables. These colors will not change unless <code>--fluid-blue-hue</code> is changed.</p>
		<div style={ { flex: '1 1 auto' } }>
			<div style={ { color: 'var(--fluid-blue-14)' } }>
				<ColorBlock value="var(--fluid-blue-0)">--fluid-blue-0 (black)</ColorBlock>
				<ColorBlock value="var(--fluid-blue-1)">--fluid-blue-1</ColorBlock>
				<ColorBlock value="var(--fluid-blue-2)">--fluid-blue-2</ColorBlock>
				<ColorBlock value="var(--fluid-blue-3)">--fluid-blue-3</ColorBlock>
				<ColorBlock value="var(--fluid-blue-4)">--fluid-blue-4</ColorBlock>
				<ColorBlock value="var(--fluid-blue-5)">--fluid-blue-5</ColorBlock>
				<ColorBlock value="var(--fluid-blue-6)">--fluid-blue-6</ColorBlock>
			</div>
			<div style={ { color: 'var(--fluid-blue-0)' } }>
				<ColorBlock value="var(--fluid-blue-7)" style={ { color: 'var(--fluid-blue-14)' } }>--fluid-opaque-7 (middle blue)</ColorBlock>
				<ColorBlock value="var(--fluid-blue-8)">--fluid-blue-8</ColorBlock>
				<ColorBlock value="var(--fluid-blue-9)">--fluid-blue-9</ColorBlock>
				<ColorBlock value="var(--fluid-blue-10)">--fluid-blue-0</ColorBlock>
				<ColorBlock value="var(--fluid-blue-11)">--fluid-blue-1</ColorBlock>
				<ColorBlock value="var(--fluid-blue-12)">--fluid-blue-12</ColorBlock>
				<ColorBlock value="var(--fluid-blue-13)">--fluid-blue-13</ColorBlock>
				<ColorBlock value="var(--fluid-blue-14)">--fluid-blue-14 (white)</ColorBlock>
			</div>
		</div>

	</Layout.ContentBoundary>
)
