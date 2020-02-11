import React, { useEffect, useState } from 'react'
import { __ } from '@wordpress/i18n'
import { getUpdaterStore, getUpdaterActions, getUpdaterSelectors } from 'data'
import { List, Button } from 'ui'
import './style.scss'

export const Updates = ( {
	updateType = { updateType },
	getItemProps = ( item, defaultProps ) => defaultProps,
	query = {
		type: updateType,
	},
	...rest

} ) => {

	return (
		<List.WordPress
			type={ 'updates' }
			query={ query }
			scrollerClassName='fl-asst-updates-list-scroller'
			getItemProps={ ( item, defaultProps ) => {
				const UpdateButton = () => {
					const updater = getUpdaterStore()
					const { setUpdateQueueItem, removeCompletedUpdate } = getUpdaterActions()
					const { getQueuedUpdate, getCompletedUpdate } = getUpdaterSelectors()
					const [ updating, setUpdating ] = useState( !! getQueuedUpdate( item.id ) )
					const { removeItem } = defaultProps

					useEffect( () => {
						if ( getCompletedUpdate( item.id ) ) {
							removeCompletedUpdate( item.id )
							removeItem( item.uuid )
						}
						const unsubscribe = updater.subscribe( () => {
							if ( getQueuedUpdate( item.id ) ) {
								setUpdating( true )
							}
						} )
						return () => unsubscribe()
					} )

					return (
						<>
						{ updating &&
							<Button tabIndex="-1">
								{__( 'Updating...' )}
							</Button>
						}
						{ ! updating &&
							<Button tabIndex="-1" onClick={ () => setUpdateQueueItem( item ) }>
								{__( 'Update' )}
							</Button>
						}
						</>
					)
				}

				return getItemProps( item, {
					...defaultProps,
					label: item.title,
					description: item.meta,
					thumbnail: item.thumbnail,
					accessory: props => <UpdateButton { ...props } />,
				} )
			} }
			{ ...rest }
		/>
	)
}
