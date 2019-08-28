import React, { useState, Fragment } from 'fl-react'
import { __ } from '@wordpress/i18n'
import PropTypes from 'prop-types'
import { Button, Icon, Form } from 'assistant/ui'

export const LoginPage = ( props ) => {

	const { doLogin, errors } = props

	const [ email, setEmail ] = useState( '' )
	const [ password, setPassword ] = useState( '' )
	const [ doingLogin, setDoingLogin ] = useState( false )


	const handleSubmit = e => {

		setDoingLogin( true )

		doLogin( email, password )

		e.preventDefault()
	}

	return (
		<Fragment>
			<Icon.Pencil size={ 75 }/>

			{doingLogin && ( <p>{__( 'Authenticating...' )}</p> )}

			{! doingLogin && (
				<Form onSubmit={ handleSubmit }>
					<Form.Section>
						<Form.Item>
							<p className="center-text">{__( 'You are not currently connected to Assistant Cloud' )}</p>
						</Form.Item>
						{ 0 < errors.length && <Form.Item className="errors">
							{
								( null !== errors && errors.map( ( error, index ) => {
									return (
										<li key={ index }>{error}</li>
									)
								} ) )
							}
						</Form.Item> }
						<Form.Item label={ __( 'Email' ) } labelFor="cloudEmail" required={ true }>
							<input
								type="email"
								id="cloudEmail"
								name="email"
								onChange={ e => setEmail( e.target.value ) }
								value={ email }
								placeholder={ __( 'john@example.com' ) }
								required
							/>
						</Form.Item>
						<Form.Item label={ __( 'Password' ) } labelFor="cloudPwd">
							<input
								type="password"
								id="cloudPwd"
								name="password"
								onChange={ e => setPassword( e.target.value ) }
								value={ password }
								placeholder={ __( 'Password' ) }
							/>
						</Form.Item>
						<Form.Item>
							<Button type="submit" className="fl-asst-cloud-connect-button">{__( 'Connect' )}</Button>
						</Form.Item>
					</Form.Section>
				</Form>
			)}
		</Fragment>
	)

}

LoginPage.propTypes = {
	doLogin: PropTypes.func.isRequired,
	errors: PropTypes.array
}
