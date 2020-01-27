import React, { useEffect, useState } from 'react'
import { __ } from '@wordpress/i18n'
import { List, Button } from 'assistant/ui'
import { getUpdaterStore, getUpdaterActions, getUpdaterSelectors } from 'assistant/data'


export const allUpdatesTab = ( {
	getItemProps = ( item, defaultProps ) => defaultProps,
	query = {
		type: 'all',
	},
	...rest
} ) => {

	return (
		<List.WordPress
			type={ 'updates' }
			query={ query }
			formatItems={ items => {
				const groups = [ {
					label: __( 'Plugins' ),
					items: [],
				}, {
					label: __( 'Themes' ),
					items: [],
				} ]
				items.map( item => {
					if ( 'plugin' === item.type ) {
						groups[0].items.push( item )
					} else {
						groups[1].items.push( item )
					}
				} )
				return groups
			} }
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
							{updating &&
								<Button tabIndex="-1">
									{__( 'Updating...' )}
								</Button>
							}
							{! updating &&
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


export const PluginsTab = ( {
	getItemProps = ( item, defaultProps ) => defaultProps,
	query = {
		type: 'plugins',
	},
	...rest
} ) => {
	return (
		<List.WordPress
			type={ 'updates' }
			query={ query }
			formatItems={ items => {
				const groups = [ {
					label: __( 'Plugins' ),
					items: [],
				}]
				items.map( item => {
					if ( 'plugin' === item.type ) {
						groups[0].items.push( item )
					}
				} )
				return groups
			} }
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
							{updating &&
								<Button tabIndex="-1">
									{__( 'Updating...' )}
								</Button>
							}
							{! updating &&
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

export const ThemesTab = ( {
	getItemProps = ( item, defaultProps ) => defaultProps,
	query = {
		type: 'themes',
	},
	...rest
} ) => {
	return (
		<List.WordPress
			type={ 'updates' }
			query={ query }
			formatItems={ items => {
				const groups = [ {
					label: __( 'Themes' ),
					items: [],
				} ]
				items.map( item => {
					if ( 'theme' === item.type ) {
						groups[0].items.push( item )
					}
				} )
				return groups
			} }
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
							{updating &&
								<Button tabIndex="-1">
									{__( 'Updating...' )}
								</Button>
							}
							{! updating &&
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
