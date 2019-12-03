import React, { useContext, useMemo } from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Form, Nav, Page } from 'ui'
import { useFormData } from '../use-form-data'
import './style.scss'

export const useForm = ( {
	tabs = {},
	sections = {},
	fields = {},
	defaults = {},
	...options // See useFormData
} ) => {
	const config = getFieldConfig( tabs, sections, fields )
	const data = useFormData( config, options, defaults )
	const { form } = data

	if ( Object.entries( tabs ).length ) {
		data.FormContent = () => (
			<>
				<Tabs config={ tabs } />
				<Form { ...form }>
					<TabsContent config={ tabs } data={ data } />
				</Form>
			</>
		)
	} else if ( Object.entries( sections ).length ) {
		data.FormContent = () => (
			<Form { ...form }>
				<Sections config={ sections } data={ data } />
			</Form>
		)
	} else {
		data.FormContent = () => (
			<Form { ...form }>
				<Fields config={ fields } data={ data } />
			</Form>
		)
	}

	return data
}

const Tabs = ( { config } ) => {
	const { history, location, match } = useContext( Nav.Context )
	const setTab = path => history.replace( path, location.state )
	return useMemo( () => (
		<Page.Pad className="fl-asst-form-tabs fl-asst-stick-to-top">
			<Button.Group appearance="tabs">
				{ Object.entries( config ).map( ( [ key, tab ], i ) => {
					const { isVisible, label, path } = tab
					if ( undefined !== isVisible && ! isVisible ) {
						return
					}
					return (
						<Button key={ i }
							onClick={ () => setTab( path ? path : match.url ) }
							isSelected={ path === location.pathname }
						>
							{ label }
						</Button>
					)
				} ) }
			</Button.Group>
		</Page.Pad>
	), [ location.pathname ] )
}

const TabsContent = ( { config, data } ) => {
	const { match } = useContext( Nav.Context )
	return useMemo( () => (
		<Nav.Switch>
			{ Object.entries( config ).map( ( [ key, tab ], i ) => {
				const { isVisible, path, exact, sections } = tab
				if ( undefined !== isVisible && ! isVisible ) {
					return
				}
				return (
					<Nav.Route
						key={ i }
						path={ path ? path : match.url }
						exact={ exact }
						component={ () => <Sections config={ sections } data={ data } /> }
					/>
				)
			} ) }
		</Nav.Switch>
	), [] )
}

const Sections = ( { config, data } ) => {
	return Object.entries( config ).map( ( [ key, section ], i ) => {
		const { isVisible, label, fields } = section
		if ( undefined !== isVisible && ! isVisible ) {
			return
		}
		return (
			<Page.Section key={ i } handle={ key } label={ label }>
				<Fields config={ fields } data={ data } />
			</Page.Section>
		)
	} )
}

const Fields = ( { config, data } ) => {
	return Object.entries( config ).map( ( [ key ], i ) => {
		const { isVisible, component, ...rest } = data.fields[ key ]
		const Field = component ? component : Form.TextItem
		if ( undefined !== isVisible && ! isVisible ) {
			return
		}
		return <Field key={ i } { ...rest } />
	} )
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
