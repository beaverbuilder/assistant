import React, { useState, useEffect } from 'react'
import { __ } from '@wordpress/i18n'
import { ENTER } from '@wordpress/keycodes'
import { Form, Button, Icon, Layout } from 'assistant/ui'
import { getSystemActions, useSystemState } from 'assistant/data'

const SubscribeForm = () => {
	const { hasSubscribed } = useSystemState( 'hasSubscribed' )
	const { setHasSubscribed } = getSystemActions()
	const [ email, setEmail ] = useState( '' )
	const [ isSubscribing, setisSubscribing ] = useState( false )
	const [ isLoadingDrip, setIsLoadingDrip ] = useState( true )
	const placeholder = __( 'email@example.com' )
	const invalidText = __( 'Please enter a valid email address.' )
	const successText = __( 'Subscribed Successfully!' )
	const errorText = __( 'There was an issue subscribing. Please try again.' )

	// Load the drip script
	useEffect( () => {
		if ( 'undefined' === typeof window._dcq ) {
			const script = document.createElement( 'script' )
			script.src = 'https://tag.getdrip.com/3112548.js'
			script.onload = () => setIsLoadingDrip( false )
			document.head.appendChild( script )
		} else {
			setIsLoadingDrip( false )
		}
	}, [] )

	const isValidEmail = email => {
		if ( /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test( email ) ) { // eslint-disable-line no-useless-escape
			return true
		}
		alert( invalidText )
		return false
	}

	const subscribeUser = () => {
		if ( isValidEmail( email ) ) {

			setisSubscribing( true )

			if ( 'undefined' !== typeof window._dcq ) {
				window._dcq.push( [
					'identify',
					{
						email: email,
						tags: [ 'Assistant Newsletter' ],
						success: function( response ) {
							if ( response.success ) {
								setisSubscribing( false )
								alert( successText )
								setEmail( '' )
								setHasSubscribed( true )
							} else {
								setisSubscribing( false )
								alert( errorText )
							}
						},
					},
				] )
			} else {
				setisSubscribing( false )
				alert( errorText )
			}
		}
	}

	if ( hasSubscribed ) {
		return (
			<Layout.Message status="primary" style={ { margin: 0, padding: 0 } }>
				{ __( 'Successfully subscribed!' ) }
			</Layout.Message>
		)
	}

	return (
		<Form.Input
			value={ email }
			onChange={ e => setEmail( e.target.value ) }
			onKeyPress={ e => ( ENTER === e.which ) && subscribeUser() }
			placeholder={ placeholder }
			before={ ( isSubscribing || isLoadingDrip ) && (
				<span>
					<Icon.Loading />
				</span>
			) }
			after={ email && (
				<Button
					onClick={ e => {
						subscribeUser()
						e.preventDefault()
					} }
				>
					<span style={ { marginRight: 'var(--fluid-sm-space)' } }>
						{__( 'Send' )}
					</span>
					<Icon.Return />
				</Button>
			) }
		/>
	)
}

export default SubscribeForm
