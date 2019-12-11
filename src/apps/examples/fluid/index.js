import React from 'react'
import { Page, Button, Icon } from 'fluid/ui'
import { __ } from '@wordpress/i18n'
import { getSystemConfig } from 'assistant/data'

const ButtonRow = ( { children, title } ) => {
	return (
		<div style={ { margin: '10px 0' } }>
			{ title && <div style={ { padding: '5 0', fontWeight: 'bold' } }>{title}</div> }
			<div style={ {
				padding: '10px 0',
				display: 'grid',
				gridGap: 5,
				gridAutoFlow: 'column'
			} }>
				{children}
			</div>
		</div>
	)
}
const ButtonSpacedRow = ( { children, title } ) => {
	return (
		<div style={ { margin: '10px 0' } }>
			{ title && <div style={ { padding: '5 0', fontWeight: 'bold' } }>{title}</div> }
			<div style={ {
				padding: '10px 0',
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'space-evenly',
			} }>
				{children}
			</div>
		</div>
	)
}

const App = () => {
	const { pluginURL } = getSystemConfig()
	return (
		<Page
			title="FLUID Page Example"
			hero={ `${pluginURL}img/fluid-hero.jpg` }
		>
			<Page.Headline>Design Elements</Page.Headline>
			<div>Buttons and stuff</div>

			<ButtonSpacedRow>
				<Button appearance="elevator">
					<Icon.Trash />
				</Button>
				<Button appearance="elevator" status="primary">
					<Icon.Restore />
				</Button>
				<Button appearance="elevator" status="alert">
					<Icon.Trash />
				</Button>
				<Button appearance="elevator" status="destructive">
					<Icon.Trash />
				</Button>
			</ButtonSpacedRow>

			<ButtonRow title="Normal">
				<Button>Button</Button>
				<Button className="is-hovering">Hovering</Button>
				<Button className="is-focused">Focused</Button>
			</ButtonRow>
			<ButtonRow title='Primary (status="primary")'>
				<Button status="primary">Button</Button>
				<Button status="primary" className="is-hovering">Hovering</Button>
				<Button status="primary" className="is-focused">Focused</Button>
			</ButtonRow>
			<ButtonRow title='Alert (status="alert")'>
				<Button status="alert">Button</Button>
				<Button status="alert" className="is-hovering">Hovering</Button>
				<Button status="alert" className="is-focused">Focused</Button>
			</ButtonRow>
			<ButtonRow title='Destructive (status="destructive")'>
				<Button status="destructive"><Icon.Trash />&nbsp;&nbsp;Button</Button>
				<Button status="destructive" className="is-hovering"><Icon.Trash />&nbsp;&nbsp;Hovering</Button>
				<Button status="destructive" className="is-focused"><Icon.Trash />&nbsp;&nbsp;Focused</Button>
			</ButtonRow>

			<Page.Section label={__('Icons')}>
				<div>
					<Icon.Trash />
					<Icon.Restore />
				</div>
			</Page.Section>

			<Page.Section label={__('Nonsense Content Just To Make It Scroll')}>
				<div>
				<h2>This is a Heading TWO</h2>
				<p>Nullam id dolor id nibh ultricies vehicula ut id elit. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Sed posuere consectetur est at lobortis. Donec sed odio dui. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.</p>
				<p>Nullam id dolor id nibh ultricies vehicula ut id elit. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Sed posuere consectetur est at lobortis. Donec sed odio dui. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.</p>
				<p>Nullam id dolor id nibh ultricies vehicula ut id elit. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Sed posuere consectetur est at lobortis. Donec sed odio dui. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.</p>

				<h2>Hey! This and this and this</h2>
				<p>Nullam id dolor id nibh ultricies vehicula ut id elit. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Sed posuere consectetur est at lobortis. Donec sed odio dui. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.</p>
				<p>Nullam id dolor id nibh ultricies vehicula ut id elit. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Sed posuere consectetur est at lobortis. Donec sed odio dui. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.</p>

				<h2>And Some More</h2>
				<p>Nullam id dolor id nibh ultricies vehicula ut id elit. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Sed posuere consectetur est at lobortis. Donec sed odio dui. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.</p>
				<p>Nullam id dolor id nibh ultricies vehicula ut id elit. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Sed posuere consectetur est at lobortis. Donec sed odio dui. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.</p>
				<p>Nullam id dolor id nibh ultricies vehicula ut id elit. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Sed posuere consectetur est at lobortis. Donec sed odio dui. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.</p>

				<h2>And Some More</h2>
				<p>Nullam id dolor id nibh ultricies vehicula ut id elit. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Sed posuere consectetur est at lobortis. Donec sed odio dui. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.</p>
				<p>Nullam id dolor id nibh ultricies vehicula ut id elit. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Sed posuere consectetur est at lobortis. Donec sed odio dui. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.</p>
				<p>Nullam id dolor id nibh ultricies vehicula ut id elit. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Sed posuere consectetur est at lobortis. Donec sed odio dui. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.</p>
				</div>
			</Page.Section>
		</Page>
	)
}

export default App
