import React, { useEffect, useState } from 'react'
import { __ } from '@wordpress/i18n'
import { getUpdaterStore, getUpdaterActions, getUpdaterSelectors } from 'data'
import { List, Button, Layout } from 'ui'
import './style.scss'

export const Updates = ( {
	updateType = { updateType },
	getItemProps = ( item, defaultProps ) => defaultProps,
	query = {
		type: updateType,
	},
	listStyle,
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

				const Before = () => (
					<Layout.Box style={{
						paddingTop: 0,
						paddingBottom: 5
					}}>
						<div
							style={{
								position: 'relative',
								paddingTop: 'plugin' === item.type ? '32.3%' : '75%',
								background: 'var(--fluid-box-background)'
							}}
						>
							<div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
								<img src={item.banner} />
							</div>
						</div>
					</Layout.Box>
				)

				return getItemProps( item, {
					...defaultProps,
					label: item.title,
					description: <>{item.version} &rarr; {item.updatedVersion}</>,
					thumbnail: 'card' !== listStyle ? item.thumbnail : null,
					accessory: props => <UpdateButton { ...props } />,
					before: 'card' === listStyle ? <Before /> : null,
				} )
			} }
			{ ...rest }
		/>
	)
}
