import React, {useState} from 'fl-react'

import cloud from 'assistant/cloud'

export default function LoginForm( props ) {

	const [ email, setEmail ] = useState( '' )
	const [ password, setPassword ] = useState( '' )
	const [ loading, setLoading ] = useState( false )

	const handleSubmit = ( event ) => {
		if ( event ) {
			event.preventDefault()

			setLoading( true )
			cloud.auth.login( email, password )
				.then( ( user ) => {
					console.log( user, 'logged in user' )
				} )
				.catch( ( err ) => {
					console.log( err, 'problem logging in' )
					setLoading( false )
				} )

		}
	}


	return loading ? (
		<p>Loading...</p>
	) : (
		<form onSubmit={handleSubmit}>
			<div>
				<label>Email</label>
				<input type="email"
					name="email"
					onChange={e => setEmail( e.target.value )}
					value={email}
					required/>
			</div>
			<div>
				<label>Password</label>
				<input type="password"
					name="password"
					onChange={e => setPassword( e.target.value )}
					value={password}/>
			</div>
			<div>
				<button type="submit" className="fl-asst-cloud-connect-button">Connect</button>
			</div>
		</form>
	)

}
