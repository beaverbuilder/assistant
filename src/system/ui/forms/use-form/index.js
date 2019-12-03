import React, { useContext, useMemo } from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Form, Nav, Page } from 'ui'
import { useFormData } from '../use-form-data'
import './style.scss'

export const useForm = ( {
	tabs = {},
	sections = {},
	fields = {},
	values = {},
	...options // See useFormData
} ) => {
	const config = getFieldConfig( tabs, sections, fields )
	const data = useFormData( config, options, values )
	const { form } = data

	if ( Object.entries( tabs ).length ) {
		data.FormTabs = () => (
			<>
				<Tabs tabs={ tabs } />
				<Form { ...form }>
					<TabsContent tabs={ tabs } />
				</Form>
			</>
		)
	} else if ( Object.entries( sections ).length ) {
		data.FormSections = () => (
			<Form { ...form }>
				<Sections sections={ sections } />
			</Form>
		)
	} else {
		data.FormFields = () => (
			<Form { ...form }>
				<Fields fields={ fields } />
			</Form>
		)
	}

	return data
}

const Tabs = ( { tabs } ) => {
	const { history, location, match } = useContext( Nav.Context )
	const setTab = path => history.replace( path, location.state )
	return (
		useMemo( () => (
			<Page.Pad className="fl-asst-form-tabs fl-asst-stick-to-top">
				<Button.Group appearance="tabs">
					{ Object.entries( tabs ).map( ( [ key, tab ], i ) => (
						<Button key={ i }
							onClick={ () => setTab( tab.path ? tab.path : match.url ) }
							isSelected={ tab.path === location.pathname }
						>
							{ tab.label }
						</Button>
					) ) }
				</Button.Group>
			</Page.Pad>
		), [ location.pathname ] )
	)
}

const TabsContent = ( { tabs } ) => {
	const { match } = useContext( Nav.Context )
	return (
		useMemo( () => (
			<Nav.Switch>
				{ Object.entries( tabs ).map( ( [ key, tab ], i ) => (
					<Nav.Route
						key={ i }
						path={ tab.path ? tab.path : match.url }
						exact={ tab.exact }
						component={ () => <p>Tab!</p> }
					/>
				) ) }
			</Nav.Switch>
		), [] )
	)
}

const Sections = ( { sections } ) => {
	return null
}

const Fields = ( { fields } ) => {
	return null
}

const getTabsFieldConfig = tabs => {
	let config = {}
	Object.values( tabs ).map( tab => {
		if ( ! tab.sections ) {
			return
		}
		config = Object.assign( config, getSectionsFieldConfig( tab.sections ) )
	} )
	return config
}

const getSectionsFieldConfig = sections => {
	let config = {}
	Object.values( sections ).map( section => {
		if ( ! section.fields ) {
			return
		}
		config = Object.assign( config, section.fields )
	} )
	return config
}

const getFieldConfig = ( tabs, sections, fields ) => {
	let config = {}

	if ( Object.entries( tabs ).length ) {
		config = Object.assign( config, getTabsFieldConfig( tabs ) )
	} else if ( Object.entries( sections ).length ) {
		config = Object.assign( config, getSectionsFieldConfig( tabs ) )
	} else {
		config = fields
	}

	return config
}
