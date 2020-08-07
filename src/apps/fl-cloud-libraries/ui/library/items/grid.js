import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Libraries } from '@beaverbuilder/cloud-ui'
import { Layout, Collection, Text } from 'assistant/ui'

export default ( { categories } ) => {
	const history = useHistory()
	const { id } = useParams()
	const baseURL = `/fl-cloud-libraries/${id}`

	return Object.values( categories ).map( ( category, i ) => {
		if ( ! category.items.length ) {
			return null
		}
		return (
			<Layout.Box key={ i } padX={ false } padY={ false }>
				<Layout.Toolbar style={ { paddingLeft: 20 } }>
					<Text.Title>{ category.name }</Text.Title>
				</Layout.Toolbar>
				<Collection>
					{ category.items.map( item => {
						return (
							<Collection.Item
								key={ item.id }
								title={ item.name }
								thumbnail={ <Libraries.ItemThumb { ...item } /> }
								onClick={ () => {
									history.push( `${baseURL}/items/${item.id}` )
								} }
							/>
						)
					} ) }
				</Collection>
			</Layout.Box>
		)
	} )
}
