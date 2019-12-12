import React from 'react'
import { Page, Button } from 'fluid/ui'
import { Icon } from 'assistant/ui'
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

const IconItem = ( { label, icon: Icon } ) => {
	return (
		<div style={ {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			textAlign: 'center',
		} }>
			<div style={ { marginBottom: 10 } }><Icon /></div>
			<div>{label}</div>
		</div>
	)
}

const App = () => {
	const { pluginURL } = getSystemConfig()

	const Footer = () => <mark>This is the page footer</mark>
	return (
		<Page
			title="FLUID Page Example"
			hero={ `${pluginURL}img/fluid-hero.jpg` }
			footer={ <Footer /> }
		>
			<Page.Headline>Design Elements</Page.Headline>
			<div>Buttons and stuff</div>

			<ButtonSpacedRow>
				<Button appearance="elevator">
					<Icon.Edit />
				</Button>
				<Button appearance="elevator" status="primary">
					<Icon.Restore />
				</Button>
				<Button appearance="elevator" status="alert">
					<Icon.Spam />
				</Button>
				<Button appearance="elevator" status="destructive">
					<Icon.Trash />
				</Button>
			</ButtonSpacedRow>

			<ButtonRow title="Normal">
				<Button>{__( 'Button' )}</Button>
				<Button className="is-hovering">Hovering</Button>
				<Button className="is-focused">Focused</Button>
			</ButtonRow>
			<ButtonRow title='Primary (status="primary")'>
				<Button status="primary"><Icon.Link />&nbsp;&nbsp;{__( 'Button' )}</Button>
				<Button status="primary" className="is-hovering"><Icon.Edit />&nbsp;&nbsp;Hovering</Button>
				<Button status="primary" className="is-focused"><Icon.Clone />&nbsp;&nbsp;Focused</Button>
			</ButtonRow>
			<ButtonRow title='Alert (status="alert")'>
				<Button status="alert"><Icon.Spam />&nbsp;&nbsp;{__( 'Button' )}</Button>
				<Button status="alert" className="is-hovering"><Icon.Spam />&nbsp;&nbsp;Hovering</Button>
				<Button status="alert" className="is-focused"><Icon.Spam />&nbsp;&nbsp;Focused</Button>
			</ButtonRow>
			<ButtonRow title='Destructive (status="destructive")'>
				<Button status="destructive"><Icon.Trash />&nbsp;&nbsp;{__( 'Button' )}</Button>
				<Button status="destructive" className="is-hovering"><Icon.Trash />&nbsp;&nbsp;Hovering</Button>
				<Button status="destructive" className="is-focused"><Icon.Trash />&nbsp;&nbsp;Focused</Button>
			</ButtonRow>

			<Page.Section label={ __( 'Icons' ) }>
				<div style={ {
					display: 'grid',
					gridTemplateColumns: 'repeat(4, 1fr)',
					gridAutoRows: 80,
					justifyItems: 'center',
					alignItems: 'center',
				} }>
					<IconItem label={ __( 'Trash' ) } icon={ Icon.Trash } />
					<IconItem label={ __( 'Restore' ) } icon={ Icon.Restore } />
					<IconItem label={ __( 'View' ) } icon={ Icon.View } />
					<IconItem label={ __( 'Edit' ) } icon={ Icon.Edit } />
					<IconItem label={ __( 'Spam' ) } icon={ Icon.Spam } />
					<IconItem label={ __( 'Unspam' ) } icon={ Icon.Unspam } />
					<IconItem label={ __( 'Back Arrow' ) } icon={ Icon.BackArrow } />
					<IconItem label={ __( 'Update' ) } icon={ Icon.Update } />
					<IconItem label={ __( 'Deactivate' ) } icon={ Icon.Deactivate } />
					<IconItem label={ __( 'Placeholder' ) } icon={ Icon.Placeholder } />
					<IconItem label={ __( 'Reply' ) } icon={ Icon.Reply } />
					<IconItem label={ __( 'Approve' ) } icon={ Icon.Approve } />
					<IconItem label={ __( 'Reject' ) } icon={ Icon.Reject } />
					<IconItem label={ __( 'Link' ) } icon={ Icon.Link } />
					<IconItem label={ __( 'Clone' ) } icon={ Icon.Clone } />
					<IconItem label={ __( 'Bookmark' ) } icon={ Icon.Bookmark } />
					<IconItem label={ __( 'Bookmark - Solid' ) } icon={ Icon.BookmarkSolid } />
				</div>
			</Page.Section>

			<Page.Section label={ __( 'Nonsense Content Just To Make It Scroll' ) }>
				<div>
					<h2>This is a Heading TWO</h2>
					<p>Nullam id dolor id nibh ultricies vehicula ut id elit. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Sed posuere consectetur est at lobortis. Donec sed odio dui. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.</p>
					<p>Nullam id dolor id nibh ultricies vehicula ut id elit. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Sed posuere consectetur est at lobortis. Donec sed odio dui. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.</p>
					<p>Nullam id dolor id nibh ultricies vehicula ut id elit. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Sed posuere consectetur est at lobortis. Donec sed odio dui. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.</p>

					<h2>Hey! This and this and this</h2>
					<p>Nullam id dolor id nibh ultricies vehicula ut id elit. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Sed posuere consectetur est at lobortis. Donec sed odio dui. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.</p>
					<p>Nullam id dolor id nibh ultricies vehicula ut id elit. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Sed posuere consectetur est at lobortis. Donec sed odio dui. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.</p>
				</div>
			</Page.Section>
		</Page>
	)
}

export default App
