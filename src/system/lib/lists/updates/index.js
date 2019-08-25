import React, { useEffect, useState } from 'fl-react'
import { __ } from '@wordpress/i18n'
import { getUpdaterStore, getUpdaterActions, getUpdaterSelectors } from 'store'
import { List, Button, Icon } from 'lib'

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

				const Extras = () => {
					const updater = getUpdaterStore()
					const { setUpdateQueueItem } = getUpdaterActions()
					const { getQueuedUpdate } = getUpdaterSelectors()
					const [ updating, setUpdating ] = useState( !! getQueuedUpdate( item.key ) )

					useEffect( () => {
						const unsubscribe = updater.subscribe( () => {
							if ( ! getQueuedUpdate( item.key ) ) {
								setUpdating( false )
							} else {
								setUpdating( true )
							}
						} )
						return () => unsubscribe()
					}, [] )

					return (
						<div className="fl-asst-item-extras" onClick={ e => e.stopPropagation() }>
							<div className="fl-asst-item-extras-left">
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
				} )
			} }
			{ ...rest }
		/>
	)
}
