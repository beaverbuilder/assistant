import React, { useEffect, useState } from 'fl-react'
import { __ } from '@wordpress/i18n'
import { getUpdaterStore, getUpdaterActions, getUpdaterSelectors } from 'store'
import { List, Button } from 'lib'

export const Updates = ( {
	getItemProps = ( item, defaultProps ) => defaultProps,
	query = {
		updateType: 'all',
	},
	...rest,
} ) => {
	return (
		<List.WordPress
			type={ 'updates' }
			query={ query }
			isListSection={ item => 'undefined' !== typeof item.items }
			getSectionItems={ section => section.items }
			getItemProps={ ( item, defaultProps, isSection ) => {
				if ( isSection ) {
					return {
						...defaultProps,
						label: item.label
					}
				}

				const UpdateButton = () => {
					const updater = getUpdaterStore()
					const { setUpdateQueueItem, removeCompletedUpdate } = getUpdaterActions()
					const { getQueuedUpdate, getCompletedUpdate } = getUpdaterSelectors()
					const [ updating, setUpdating ] = useState( !! getQueuedUpdate( item.id ) )
					const { removeItem } = defaultProps

					useEffect( () => {
						if ( getCompletedUpdate( item.id ) ) {
							removeCompletedUpdate( item.id )
							removeItem()
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

				const Extras = () => {
					return (
						<div className="fl-asst-item-extras" onClick={ e => e.stopPropagation() }>
							<div className="fl-asst-item-extras-left">
								<UpdateButton />
							</div>
						</div>
					)
				}

				return getItemProps( item, {
					...defaultProps,
					label: item.title,
					description: item.meta,
					thumbnail: item.thumbnail,
					extras: props => <Extras { ...props } />,
					accessory: props => <UpdateButton { ...props } />,
				} )
			} }
			{ ...rest }
		/>
	)
}
