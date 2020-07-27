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
				<div style={{
					display: 'grid',
					gridTemplateColumns: 'repeat( 2, minmax(0, 1fr) )',
					gridGap: 'var(--fluid-med-space)'
				}}>
					{ category.items.map( ( item, k ) =>
						<Layout.Box
							key={ k }
							style={ {
								cursor: 'pointer'
							} }
							onClick={ () => {
								history.push( `${baseURL}/items/${item.id}` )
							} }
							padX={false}
							padY={false}
						>
							<ItemThumb item={ item } />
							<div className="fl-asst-library-item-title" >
								{ item.name }
							</div>
						</Layout.Box>
					) }
				</div>
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
