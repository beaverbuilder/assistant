import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Layout, Collection, Text, Icon } from 'assistant/ui'

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
					{ category.items.map( ( item, k ) => {
						return (
							<Collection.Item
								key={ item.id }
								title={ item.name }
								thumbnail={ <ItemThumb { ...item } /> }
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

const ItemThumb = ( { type, data, media } ) => {

	if ( media.length ) {
		return <img src={ media[0].thumb } />
	}
	if ( 'svg' === type ) {
		return (
			<div
				dangerouslySetInnerHTML={ {
					__html: data.xml
				} }
				className="fl-asst-item-svg-container"
			/>
		)
	}
	return null
}
