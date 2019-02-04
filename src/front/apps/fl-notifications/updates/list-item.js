import React, { useEffect, useState } from 'react'
import classname from 'classnames'

//import { updatePlugin, updateTheme } from 'utils/rest-api'
import { Button, ContentListItem, Icon } from 'components'
import './style.scss'

export const UpdatesListItem = ( { className, removeItem, ...props } ) => {
	const [ updating, setUpdating ] = useState( false )
	const [ updated, setUpdated ] = useState( false )
	const [ error, setError ] = useState( false )

	//const [ promise, setPromise ] = useState( null )
	const [ buttonText, setButtonText ] = useState( 'Update' )

	useEffect( () => {

		//return () => promise && promise.cancel()
	} )

	const updateClicked = e => {
		e.stopPropagation()

		//const { type, plugin, theme } = props.data

		if ( updating || updated || error ) {
			return
		}

		setUpdating( true )
		setError( false )
		setButtonText( 'Updating' )

		// Fake updating for now until server side issues are fixed.
		setTimeout( () => updateComplete( { success: true } ), 3000 )

		// if ( 'plugin' === type ) {
		// 	setPromise( updatePlugin( plugin, updateComplete ) )
		// } else {
		// 	setPromise( updateTheme( theme, updateComplete ) )
		// }
	}

	const updateComplete = response => {
		if ( response.success ) {
			setUpdating( false )
			setUpdated( true )
			setButtonText( 'Updated!' )
			setTimeout( () => {
				setUpdated( false )
				setButtonText( 'Update' )
				removeItem()
			}, 3000 )
		} else if ( response.error ) {
			setUpdating( false )
			setError( true )
			setButtonText( 'Error!' )
			setTimeout( () => {
				setError( false )
				setButtonText( 'Update' )
			}, 3000 )
		}
	}

	const classes = classname( className, {
		'fl-asst-update-item': true,
		'fl-asst-update-item-updating': updating,
		'fl-asst-update-item-updated': updated,
		'fl-asst-update-item-error': error,
	} )

	return (
		<ContentListItem className={ classes } { ...props }>
			<div className='fl-asst-update-button'>
				<Button onClick={ updateClicked }>
					{ updating && <Icon name='small-spinner' /> }
					{ buttonText }
				</Button>
			</div>
		</ContentListItem>
	)
}
