import React, { useState } from 'react'
import { __ } from '@wordpress/i18n'
import { Libraries } from '@beaverbuilder/cloud-ui'
import { Text } from 'fluid'
import { Icon, Layout } from 'assistant/ui'
import { getWpRest } from 'assistant/utils/wordpress'

export default ( { results } ) => {

	if ( ! results ) {
		return null
	}

	if ( results && ! results.length ) {
		return (
			<Layout.Box padY={ false } style={ { textAlign: 'center' } }>
				{ __( 'No results found' ) }
			</Layout.Box>
		)
	}

	return results.map( ( result, key ) => {
		const { label, items } = result
		return (
			<Layout.Box
				key={ key }
				className='fl-asst-library-add-post-results'
				padX={ false }
				padY={ false }
			>
				<Text.Title>
					{ label }
				</Text.Title>
				<ul>
					{ items.map( ( item, key ) =>
						<PostItem key={ key } post={ item } />
					) }
				</ul>
			</Layout.Box>
		)
	} )
}

const PostItem = ( { post } ) => {
	const { library, items, setItems } = Libraries.LibraryContext.use()
	const [ adding, setAdding ] = useState( false )
	const [ added, setAdded ] = useState( false )

	const addPost = () => {
		const api = getWpRest().posts()
		setAdding( true )
		api.saveToLibrary( post.id, library.id ).then( response => {
			items.push( response.data )
			setItems( [ ...items ] )
			setAdded( true )
		} ).finally( () => {
			setAdding( false )
		} )
	}

	return (
		<li onClick={ addPost }>
			<div>
				{ post.title }
			</div>
			{ adding &&
				<a><Icon.Loading /></a>
			}
			{ added &&
				<a>{ __( 'Added!' ) }</a>
			}
			{ ! adding && ! added &&
				<a>{ __( 'Add' ) }</a>
			}
		</li>
	)
}
