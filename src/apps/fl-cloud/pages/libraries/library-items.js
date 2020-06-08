import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { __ } from '@wordpress/i18n'
import { Button, Filter, Icon, Layout, List, Page } from 'assistant/ui'
import cloud from 'assistant/utils/cloud'
import { getWpRest } from 'assistant/utils/wordpress'

export default ( { library } ) => {
	const [ loading, setLoading ] = useState( true )
	const [ collections ] = cloud.libraries.useCollections( library.id )
	const { items, setItems, ...actions } = List.useListItems()

	const defaultFilter = {
		type: 'any',
		collection: 'any',
	}

	const [ filter, setFilter ] = useState( defaultFilter )

	useEffect( () => {
		cloud.libraries.getItems( library.id, filter ).then( response => {
			setItems( response.data )
			setLoading( false )
		} )
	}, [ filter ] )

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

	const getCollectionOptions = () => {
		const options = {
			any: __( 'Any' ),
		}
		if ( collections ) {
			collections.map( collection => {
				options[ collection.name ] = collection.name
			} )
		}
		return options
	}

	if ( loading ) {
		return <Page.Loading />
	}

	if ( ! items.length && 'any' === filter.type && 'any' === filter.collection ) {
		return (
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
		)
	}

	return (
		<>
			<Filter>
				<Filter.RadioGroupItem
					title={ __( 'Type' ) }
					items={ {
						any: __( 'Any' ),
						post: __( 'Posts' ),
						image: __( 'Images' ),
						svg: __( 'SVG' ),
						color: __( 'Color' )
					} }
					value={ filter.type }
					defaultValue={ defaultFilter.type }
					onChange={ value => setFilter( { ...filter, type: value } ) }
				/>
				{ collections &&
					<Filter.RadioGroupItem
						title={ __( 'Collection' ) }
						items={ getCollectionOptions() }
						value={ filter.collection }
						defaultValue={ defaultFilter.collection }
						onChange={ value => setFilter( { ...filter, collection: value } ) }
					/>
				}
				<Filter.Button onClick={ () => setFilter( defaultFilter ) }>{__( 'Reset Filter' )}</Filter.Button>
			</Filter>
			{ !! items.length &&
				<List
					items={ items }
					getItemProps={ getItemProps }
				/>
			}
			{ ! items.length &&
				<List.NoResultsMessage />
			}
		</>
	)
}

const ItemActions = ( { library, item, actions } ) => {
	const { removeItem } = actions
	const wpRest = getWpRest()
	const [ postExist, setpostExist ] = useState( false )
	const history = useHistory()
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
						history.push(`/fl-cloud/libraries/${library.id}/import/${item.id}`)

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
