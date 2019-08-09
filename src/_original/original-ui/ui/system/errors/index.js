import React, { useState, useEffect, useContext } from 'react'
import { __, sprintf } from '@wordpress/i18n'
import UAParser from 'ua-parser-js'
import { Heading, Form, Branding, AppContext, Padding, Button, Icon, UIContext } from 'components'
import { ErrorBoundary } from 'shared-lib'

export const OuterErrorBoundary = props => {
	const merged = {
		...props,
		alternate: <ErrorScreen shouldShowCloseButton={ true } />
	}
	return <ErrorBoundary { ...merged } />
}

export const AppErrorBoundary = props => {
	const { label } = useContext( AppContext )

	let message = __( 'There seems to be a problem with this app' )
	if ( 'undefined' !== typeof label ) {
		message = sprintf( __( 'There seems to be a problem with the %s app' ), label )
	}

	const merged = {
		...props,
		alternate: <ErrorScreen message={ message } />,
	}
	return <ErrorBoundary { ...merged } />
}

const ErrorScreen = props => {
	const { setIsShowingUI } = useContext( UIContext )
	const {
		message = __( 'Oh no! There seems to be a problem.' ),
		children,
		error,
		shouldShowCloseButton = false,
	} = props

	const styles = {
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		zIndex: 1,
	}

	return (
		<div className="fl-asst-appearance-form" style={ styles }>
			<Padding style={ { textAlign: 'center' } } bottom={ false } top={ false }>
				<span style={ { color: 'var(--fl-asst-error-color)' } }><Branding name="outline" size={ 75 } /></span>
				{ message && <Heading style={ { marginTop: 30 } }>{message}</Heading> }
			</Padding>
			{children}
			<Diagnostics error={ error } />
			{ shouldShowCloseButton &&
			<div style={ { position: 'absolute', top: 0, right: 0, padding: 10, zIndex: 1 } }>
				<Button onClick={ () => setIsShowingUI( false ) } appearance="icon">
					<Icon name="close" />
				</Button>
			</div>
			}
		</div>
	)
}

const Diagnostics = ( { error } ) => {
	const defaults = {
		browser: {
			name: null,
			version: null,
			major: null,
		},
		os: {
			name: null,
			version: null,
		}
	}
	const [ results, setResults ] = useState( defaults )

	const { name = '', message = '' } = error

	useEffect( () => {
		const parser = new UAParser()
		setResults( parser.getResult() )
	}, [] )
	const { browser, os } = results

	return (
		<div style={ { width: '100%' } }>
			<form>
				<Form.Section label={ __( 'Error Information' ) } isInset={ true }>
					<Form.Item label={ __( 'Error Type' ) } placement='beside'>{name}</Form.Item>
					<Form.Item label={ __( 'Message' ) } placement='beside'>{message}</Form.Item>
				</Form.Section>
				<Form.Section label={ __( 'System Details' ) } isInset={ true }>
					<Form.Item label={ __( 'Browser' ) } placement='beside'>{browser.name} {browser.version}</Form.Item>
					<Form.Item label={ __( 'Operating System' ) } placement='beside'>{os.name} {os.version}</Form.Item>
				</Form.Section>
			</form>
		</div>
	)
}
