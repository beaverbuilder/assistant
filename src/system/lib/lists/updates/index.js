import React, { useEffect, useRef, useState } from 'fl-react'
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
					const { setUpdateQueueItem } = getUpdaterActions()
					const { getQueuedUpdate, getUpdateQueue, getCurrentUpdate } = getUpdaterSelectors()
					const [ updating, setUpdating ] = useState( !! getQueuedUpdate( item.id ) )
					const mounted = useRef()

					useEffect( () => {
						mounted.current = true
						return () => mounted.current = false
					}, [] )

					useEffect( () => {
						const unsubscribe = updater.subscribe( () => {
							const queued = getQueuedUpdate( item.id )
							const { removeItem } = defaultProps
							if ( ! queued && updating && mounted.current ) {
								setUpdating( false )
								removeItem()
							} else if ( queued ) {
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
