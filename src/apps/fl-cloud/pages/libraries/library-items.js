import React, { useEffect, useState } from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Icon, Layout, List, Page } from 'assistant/ui'
import cloud from 'assistant/utils/cloud'
import { getWpRest } from 'assistant/utils/wordpress'

export default ( { library } ) => {
	const [ loading, setLoading ] = useState( true )
	const { items, setItems, ...actions } = List.useListItems()

	useEffect( () => {
		cloud.libraries.getItems( library.id ).then( response => {
			setItems( response.data )
			setLoading( false )
		} )
	}, [] )

	const getItemProps = ( item, defaults ) => {
		return {
			...defaults,
			label: item.name,
			shouldAlwaysShowThumbnail: true,
			thumbnail: item.media ? item.media.thumb : null,
			to: {
				pathname: `/fl-cloud/libraries/${library.id}/items/${item.id}`,
				state: { item }
			},
			extras: () => (
				<ItemActions
					library={ library }
					item={ item }
					actions={ actions }
				/>
			),
		}
	}

	if ( loading ) {
		return <Page.Loading />
	}

	return (
		<>
			{ ! items.length &&
				<Layout.Box
					style={ {
						textAlign: 'center',
						justifyContent: 'center'
					} }
				>
					<div style={ { marginBottom: 'var(--fluid-lg-space)' } }>
						{ __( 'This library doesn\'t have any items yet.' ) }
					</div>
					<div>
						<Button to={ `/fl-cloud/libraries/${ library.id }/items/new` }>
							{ __( 'Add Item' ) }
						</Button>
					</div>
				</Layout.Box>
			}
			{ !! items.length &&
				<List
					items={ items }
					getItemProps={ getItemProps }
				/>
			}
		</>
	)
}

const ItemActions = ( { library, item, actions } ) => {
	const { removeItem } = actions
	const wpRest = getWpRest()
	const [ postExist, setpostExist ] = useState( false )
	const deleteItem = () => {
		if ( confirm( __( 'Do you really want to delete this item?' ) ) ) {
			cloud.libraries.deleteItem( item.id )
			removeItem( item.uuid )
		}
	}

	const importItem = () => {
		if ( confirm( __( 'Do you really want to import this item?' ) ) ) {
			wpRest.posts().importLibPost( item ).then( response => {
				if( typeof response.data.post_exist !== 'undefined' && response.data.post_exist === true){
						setpostExist(true)
				}
			})

		}
	}

	return (
		<div className="fl-asst-item-extras">
			<Button
				title={ __( 'View Item' ) }
				tabIndex="-1"
				appearance="transparent"
				to={ {
					pathname: `/fl-cloud/libraries/${library.id}/items/${item.id}`,
					state: { item }
				} }
			>
				<Icon.View />
			</Button>
			<Button
				onClick={ importItem }
				title={ __( 'Import Item' ) }
				tabIndex="-1"
				appearance="transparent"

			><Icon.Update />
			</Button>
			<Button
				onClick={ deleteItem }
				title={ __( 'Delete Item' ) }
				tabIndex="-1"
				appearance="transparent"
				status="destructive"
			>
				<Icon.Trash />
			</Button>
		</div>
	)
}
