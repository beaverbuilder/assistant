import React from 'react'
import { registerStore, useStore, getDispatch } from './'

const STORE_KEY = 'example-store'

registerStore( STORE_KEY, {
	state: {
		fooBar: false
	}
} )

export const Example = () => {
	return (
		<div>
			<p><ExampleComponent1 /></p>
			<p><ExampleComponent2 /></p>
		</div>
	)
}

export const ExampleComponent1 = () => {
	const { fooBar } = useStore( STORE_KEY )
	const { setFooBar } = getDispatch( STORE_KEY )

	return (
		<button onClick={ () => setFooBar( ! fooBar ) }  className='fl-asst-button'>
			{ fooBar ? 'Change us again!' : 'We share state. Change us!' }
		</button>
	)
}

export const ExampleComponent2 = () => {
	const { fooBar } = useStore( STORE_KEY )
	const { setFooBar } = getDispatch( STORE_KEY )

	return (
		<button onClick={ () => setFooBar( ! fooBar ) }  className='fl-asst-button'>
			{ fooBar ? 'Change us again!' : 'We share state. Change us!' }
		</button>
	)
}
