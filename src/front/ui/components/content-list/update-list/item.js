import React, { useContext, useEffect, useState } from 'react'
import classname from 'classnames'
import { updater } from 'utils/wordpress'
import { useDispatch } from 'store'
import { Button, ContentListItem, Icon, ItemContext } from 'components'

export const UpdateListItem = props => {
	const { className } = props
	const { decrementCount } = useDispatch()
	const { key, type, metaUpdated, updateItem } = useContext( ItemContext )
	const [ error, setError ] = useState( false )
	const [ updated, setUpdated ] = useState( false )
	const [ updating, setUpdating ] = useState( updater.isQueued( type, key ) )

	useEffect( () => {
		updater.subscribe( type, key, response => {
			setUpdating( false )
			if ( response.success ) {
				updateItem( { meta: metaUpdated } )
				decrementCount( 'notifications/updates' )
				setUpdated( true )
			} else {
				setError( true )
				setTimeout( () => setError( false ), 3000 )
			}
		} )
		return () => updater.unsubscribe( type, key )
	} )

	const updateClicked = e => {
		e.stopPropagation()
		if ( error || updated || updating ) {
			return
		}
		setUpdating( true )
		updater.queue( type, key )
	}

	const getButtonText = () => {
		if ( updated ) {
			return 'Updated!'
		} else if ( error ) {
			return 'Error!'
		}
		return 'Update'
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
					{ getButtonText() }
				</Button>
			</div>
		</ContentListItem>
	)
}
