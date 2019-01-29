import React, { StrictMode } from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { UI, ShowUITrigger } from './ui'
import store, { useStore, useDispatch } from 'store'
import './api'
import './apps'

/**
 * The Root Component
 */
const App = () => {
	const { showUI } = useStore()
	const { setShowUI } = useDispatch()

	// Create a toggle function to show/hide the panel
	const toggleUI = () => showUI ? setShowUI( false ) : setShowUI( true )

	return (
		<StrictMode>
			<Provider store={store}>
				{/* This is the button that toggles the UI panel */}
				<ShowUITrigger onClick={toggleUI} />

				{/* This is the panel itself */}
				<UI isShowing={showUI} toggleUI={toggleUI} />
			</Provider>
		</StrictMode>
	)
}

// Render App into the document
const root = document.createElement( 'div' )
root.classList.add( 'fl-asst' )
document.body.appendChild( root )

render( <App />, root )
