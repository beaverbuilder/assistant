import React, { useContext, useMemo } from 'react'
import { Button, Form, Nav, Page } from 'ui'

export const useFormRenderer = ( {
	tabs = null,
	sections = null,
	config = {},
	options = {},
	values = {},
} ) => {
	const formObj = Form.useForm( config, options, values )
	const { form, useFormContext } = formObj
	const { history, location } = useContext( Nav.Context )

	const renderSections = ( sections ) => {
		return sections.map( ( section, i ) => (
			<Page.RegisteredSections
				key={ i }
				location={ section.location }
				data={ {
					...section.data,
					useForm: useFormContext,
				} }
			/>
		) )
	}

	const renderFormSections = () => {
		return (
			<Form { ...form }>
				{ renderSections( sections ) }
			</Form>
		)
	}

	const renderFormTabs = () => {
		const setTab = path => history.replace( path, location.state )
		return (
			<>
				{ useMemo( () => (
					<Page.Pad
						className="fl-asst-stick-to-top"
						style={ {
							display: 'flex',
							justifyContent: 'center',
							flexShrink: 0,
							padding: 0,
						} }
					>
						<Button.Group appearance="tabs">
							{ tabs.map( ( { label, path }, i ) => (
								<Button key={ i }
									onClick={ () => setTab( path ) }
									isSelected={ path === location.pathname }
								>
									{ label }
								</Button>
							) ) }
						</Button.Group>
					</Page.Pad>
				), [ location.pathname ] ) }

				<Form { ...form }>
					{ useMemo( () => (
						<Nav.Switch>
							{ tabs.map( ( tab, i ) => (
								<Nav.Route
									key={ i }
									path={ tab.path }
									exact={ tab.exact }
									component={ () => renderSections( tab.sections ) }
								/>
							) ) }
						</Nav.Switch>
					), [] ) }
				</Form>
			</>
		)
	}

	const renderForm = () => {
		if ( sections ) {
			return renderFormSections()
		} else if ( tabs ) {
			return renderFormTabs()
		}
		return null
	}

	return {
		...formObj,
		renderForm,
	}
}
