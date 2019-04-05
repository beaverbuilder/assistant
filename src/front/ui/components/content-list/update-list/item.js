import React, { useContext, useEffect, useState } from 'react'
import classname from 'classnames'
import { __ } from '@wordpress/i18n'
import { updater } from 'utils/wordpress'
import { getSystemActions } from 'store'
import { Button, ContentListItem, Icon, ItemContext, StackContext } from 'components'
import { UpdateDetail } from './detail'

export const UpdateListItem = props => {
	const { className } = props
	const context = useContext( ItemContext )
	const { key, type, metaUpdated, updateItem } = context
	const { present } = useContext( StackContext )
	const { decrementCount } = getSystemActions()
	const [ error, setError ] = useState( false )
	const [ updated, setUpdated ] = useState( false )
	const [ updating, setUpdating ] = useState( updater.isQueued( type, key ) )

	useEffect( () => {
		updater.subscribe( type, key, response => {
			updateItem( { updating: false } )
			setUpdating( false )
			if ( response.success ) {
				updateItem( { meta: metaUpdated } )
				decrementCount( 'update/total' )
				setUpdated( true )
			} else {
				setError( true )
				setTimeout( () => setError( false ), 3000 )
			}
		} )
		return () => updater.unsubscribe( type, key )
	} )

	useEffect( () => {
		updateItem( { updatingText: getButtonText() } )
	}, [ error, updated, updating ] )

	const updateClicked = e => {
		e.stopPropagation()
		if ( error || updated || updating ) {
			return
		}
		updateItem( { updating: true } )
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
		<ContentListItem
			className={ classes }
			onClick={ () => present( {
				label: 'plugin' === type ? __( 'Plugin' ) : __( 'Theme' ),
				content: <UpdateDetail />,
				appearance: 'form',
				context: Object.assign( context, {
					updatingText: getButtonText(),
					updating,
					updateClicked,
				} ),
			} ) }
			{ ...props }
		>
			<div className='fl-asst-update-button'>
				<Button onClick={ updateClicked }>
					{ updating && <Icon name='small-spinner' /> }
					{ getButtonText() }
				</Button>
			</div>
		</ContentListItem>
	)
}
