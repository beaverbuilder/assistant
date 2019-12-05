import React, { useContext } from 'react'
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

	const renderForm = () => {
		if ( Object.entries( tabs ).length ) {
			return (
				<>
					<Tabs config={ tabs } />
					<Form { ...form }>
						<TabsContent config={ tabs } data={ data } />
					</Form>
				</>
			)
		} else if ( Object.entries( sections ).length ) {
			return (
				<Form { ...form }>
					<Sections config={ sections } data={ data } />
				</Form>
			)
		} else {
			return (
				<Form { ...form }>
					<Page.Section>
						<Fields config={ fields } data={ data } />
					</Page.Section>
				</Form>
			)
		}
	}

	return { renderForm, ...data }
}

const Tabs = ( { config } ) => {
	const { history, location, match } = useContext( Nav.Context )
	const setTab = path => history.replace( path, location.state )
	return (
		<Page.Pad className="fl-asst-form-tabs fl-asst-stick-to-top">
			<Button.Group appearance="tabs">
				{ Object.entries( config ).map( ( [ , tab ], i ) => {
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
	)
}

const TabsContent = ( { config, data } ) => {
	const { match } = useContext( Nav.Context )
	return (
		<Nav.Switch>
			{ Object.entries( config ).map( ( [ , tab ], i ) => {
				const { isVisible, path, exact, sections } = tab
				if ( undefined !== isVisible && ! isVisible ) {
					return
				}
				return (
					<Nav.Route
						key={ i }
						path={ path ? path : match.url }
						exact={ exact }
						render={ () => {
							if ( 'function' === typeof sections ) {
								const Component = sections
								return <Component { ...data } />
							}
							return <Sections config={ sections } data={ data } />
						} }
					/>
				)
			} ) }
		</Nav.Switch>
	)
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
	if ( 'function' === typeof config ) {
		const Component = config
		return <Component { ...data } />
	}
	return Object.entries( config ).map( ( [ key ], i ) => {
		const {
			component,
			label,
			labelPlacement,
			id,
			isRequired,
			isVisible,
			hasChanges,
			...rest
		} = data.fields[ key ]
		const Field = component ? component : Form.TextItem
		return (
			<Form.Item
				key={ i }
				label={ label }
				labelPlacement={ labelPlacement }
				labelFor={ id }
				isRequired={ isRequired }
				isVisible={ isVisible }
				hasChanges={ hasChanges }
			>
				<Field id={ id } { ...rest } />
			</Form.Item>
		)
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
		} else if ( 'function' !== typeof section.fields ) {
			config = Object.assign( config, section.fields )
		}
	} )
	return config
}

const getFieldConfig = ( tabs, sections, fields ) => {
	let config = {}

	if ( Object.entries( tabs ).length ) {
		config = Object.assign( config, getTabsFieldConfig( tabs ) )
	} else if ( Object.entries( sections ).length ) {
		config = Object.assign( config, getSectionsFieldConfig( sections ) )
	} else if ( 'function' !== typeof fields ) {
		config = fields
	}

	return config
}
