import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Layout } from 'assistant/ui'

export default ( { categories } ) => {
	const history = useHistory()
	const { id } = useParams()
	const baseURL = `/fl-cloud-libraries/${id}`

	return Object.values( categories ).map( ( category, i ) => {
		if ( ! category.items.length ) {
			return null
		}
		return (
			<Layout.Box key={ i }>
				<h3>{ category.name }</h3>
				<Layout.Box style={ {
					flexDirection: 'row',
					flexWrap: 'wrap',
					padding: 0
				} }>
					{ category.items.map( ( item, k ) =>
						<Layout.Box
							key={ k }
							style={ {
								width: '50%',
								cursor: 'pointer'
							} }
							onClick={ () => {
								history.push( `${baseURL}/items/${item.id}` )
							} }
						>
							<ItemThumb item={ item } />
							<div style={ {
								textAlign: 'center',
								textOverflow: 'ellipsis',
								whiteSpace: 'nowrap',
								overflow: 'hidden',
								paddingTop: 'var(--fluid-lg-space)'
							} }>
								{ item.name }
							</div>
						</Layout.Box>
					) }
				</Layout.Box>
			</Layout.Box>
		)
	} )
}

const ItemThumb = ( { item } ) => {
	return (
		<Layout.AspectBox>
			{ !! item.media.length &&
				<img src={ item.media[0].thumb } />
			}
		</Layout.AspectBox>
	)
}
