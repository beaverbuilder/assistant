import React from 'react'
import * as Text from '../../text'

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
	<Text.ContentArea>
		<h1>Color</h1>

		<h2>Value Scale</h2>
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
	</Text.ContentArea>
)
